// Google Analytics 4, behind consent. Nothing loads unless NUXT_PUBLIC_GA_ID is set and the
// visitor accepts in the consent banner; a refusal is remembered and nothing is sent.
// Vercel Web Analytics and Speed Insights (modules in nuxt.config) are cookieless and run regardless.
// Page views are sent here on every route change, so in GA4 turn off Enhanced measurement →
// "Page changes based on browser history events" to avoid counting them twice.
type Consent = 'granted' | 'denied' | null
type Gtag = (...args: unknown[]) => void
declare global {
    interface Window { dataLayer?: unknown[], gtag?: Gtag }
}

const KEY = 'analytics-consent'

export default defineNuxtPlugin((nuxtApp) => {
    const { public: { gaId } } = useRuntimeConfig()
    const consent = useState<Consent>('analytics-consent', () => null)
    const enabled = Boolean(gaId)
    let loaded = false

    try {
        const stored = localStorage.getItem(KEY)
        consent.value = stored === 'granted' || stored === 'denied' ? stored : null
    } catch {}

    function pageView() {
        window.gtag?.('event', 'page_view', { page_location: window.location.href, page_path: window.location.pathname, page_title: document.title })
    }

    function load() {
        if (!enabled || loaded) return
        loaded = true
        window.dataLayer = window.dataLayer || []
        window.gtag = function gtag() { window.dataLayer!.push(arguments) } as Gtag
        window.gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' })
        window.gtag('js', new Date())
        window.gtag('config', gaId, { send_page_view: false })
        const script = document.createElement('script')
        script.async = true
        script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`
        document.head.appendChild(script)
        pageView()
    }

    function choose(value: 'granted' | 'denied') {
        consent.value = value
        try { localStorage.setItem(KEY, value) } catch {}
        if (value === 'granted') load()
        else window.gtag?.('consent', 'update', { analytics_storage: 'denied' })
    }

    function reset() {
        consent.value = null
        try { localStorage.removeItem(KEY) } catch {}
    }

    // Conversions and engagement: no-ops until analytics is loaded.
    function track(name: string, params: Record<string, unknown> = {}) {
        if (loaded && consent.value === 'granted') window.gtag?.('event', name, params)
    }

    if (enabled && consent.value === 'granted') nuxtApp.hook('app:mounted', load)
    nuxtApp.$router.afterEach((to, from) => {
        if (loaded && consent.value === 'granted' && to.path !== from.path) nextTick(pageView)
    })

    return { provide: { analytics: { enabled, consent, choose, reset, track } } }
})

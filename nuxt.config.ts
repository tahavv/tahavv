// https://nuxt.com/docs/api/configuration/nuxt-config
const siteUrl = (process.env.NUXT_PUBLIC_SITE_URL || 'https://taha-ayari.vercel.app').replace(/\/$/, '')

// Only the production deployment may be indexed. Vercel previews (and any build that sets
// VERCEL_ENV to something else) answer every request with noindex, so they never compete with it.
const indexable = (process.env.VERCEL_ENV ?? 'production') === 'production'

// Marks the page as scripted before first paint, so motion-only states stay scoped.
const themeScript = `document.documentElement.classList.add('js')`

const security = {
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
    'X-Frame-Options': 'DENY',
    'Content-Security-Policy': "frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
}
const noindex = indexable ? {} : { 'X-Robots-Tag': 'noindex, nofollow' }
// Files in public/ keep their names between deployments, so they are cached for a week, not forever.
const publicAsset = { headers: { 'Cache-Control': 'public, max-age=604800, stale-while-revalidate=86400' } }

export default defineNuxtConfig({
    compatibilityDate: '2026-10-27',
    devtools: { enabled: false },
    modules: ['@nuxt/fonts', '@nuxt/image', '@vercel/analytics/nuxt', '@vercel/speed-insights/nuxt'],
    components: [{ path: '~/components', pathPrefix: false }],
    css: ['~/assets/css/main.css'],
    runtimeConfig: {
        resendApiKey: '',
        contactFromEmail: '',
        contactFromName: 'Portfolio contact form',
        contactToEmail: '',
        public: {
            siteUrl,
            indexable,
            // Set these in Vercel; empty values switch the feature off.
            gaId: '',
            googleSiteVerification: '',
            bingSiteVerification: ''
        }
    },
    // Geist and Geist Mono, downloaded at build time and served from this domain,
    // with metric-matched fallbacks so the text does not shift when they load.
    fonts: {
        families: [
            { name: 'Geist', provider: 'google', weights: [300, 400, 500, 700] },
            { name: 'Geist Mono', provider: 'google', weights: [400, 500] }
        ],
        defaults: { subsets: ['latin'] }
    },
    // On Vercel, images are resized and served as AVIF or WebP by Vercel's image optimisation.
    image: {
        formats: ['avif', 'webp'],
        quality: 75,
        screens: { xs: 320, sm: 640, md: 768, lg: 1024, xl: 1280 }
    },
    routeRules: {
        '/**': { headers: { ...security, ...noindex } },
        '/': { prerender: true },
        '/projects/**': { prerender: true },
        '/sitemap.xml': { prerender: true },
        '/robots.txt': { prerender: true },
        '/api/**': { headers: { 'X-Robots-Tag': 'noindex', 'Cache-Control': 'no-store' } },
        '/images/**': publicAsset,
        '/og.png': publicAsset,
        '/icons/**': publicAsset,
        '/taha_ayari_cv_en.pdf': publicAsset
    },
    app: {
        head: {
            htmlAttrs: { lang: 'en', 'data-theme': 'dark' },
            titleTemplate: '%s',
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                { name: 'author', content: 'Taha Ayari' },
                { name: 'theme-color', content: '#000000' },
                { name: 'color-scheme', content: 'dark light' },
                { property: 'og:site_name', content: 'Taha Ayari' },
                { property: 'og:locale', content: 'en_US' },
                { name: 'twitter:card', content: 'summary_large_image' },
                ...(indexable ? [] : [{ name: 'robots', content: 'noindex, nofollow' }])
            ],
            link: [
                { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
                { rel: 'icon', href: '/favicon.ico', sizes: '32x32' },
                { rel: 'apple-touch-icon', href: '/icons/apple-touch-icon.png' },
                { rel: 'manifest', href: '/site.webmanifest' }
            ],
            script: [{ innerHTML: themeScript, tagPosition: 'head' }]
        }
    },
    nitro: {
        compressPublicAssets: true,
        prerender: { crawlLinks: true, routes: ['/', '/sitemap.xml', '/robots.txt'] }
    }
})

// https://nuxt.com/docs/api/configuration/nuxt-config
const siteUrl = (process.env.NUXT_PUBLIC_SITE_URL || 'https://taha-ayari.vercel.app').replace(/\/$/, '')

// Marks the page as scripted before first paint, so motion-only states stay scoped.
const themeScript = `document.documentElement.classList.add('js')`

export default defineNuxtConfig({
    compatibilityDate: '2026-10-27',
    devtools: { enabled: false },
    modules: ['@vercel/analytics/nuxt', '@vercel/speed-insights/nuxt'],
    components: [{ path: '~/components', pathPrefix: false }],
    css: ['~/assets/css/main.css'],
    runtimeConfig: {
        senderApiToken: '',
        contactFromEmail: '',
        contactFromName: 'Portfolio contact form',
        contactToEmail: '',
        public: { siteUrl }
    },
    routeRules: {
        '/': { prerender: true },
        '/projects/**': { prerender: true },
        '/sitemap.xml': { prerender: true }
    },
    app: {
        head: {
            htmlAttrs: { lang: 'en', 'data-theme': 'dark' },
            titleTemplate: '%s',
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                { name: 'author', content: 'Taha Ayari' },
                { name: 'theme-color', content: '#03050d' },
                { property: 'og:site_name', content: 'Taha Ayari' },
                { property: 'og:locale', content: 'en_US' },
                { name: 'twitter:card', content: 'summary_large_image' }
            ],
            link: [
                { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
                { rel: 'icon', href: '/favicon.ico', sizes: '32x32' },
                { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
                { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
                { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500&family=Geist+Mono:wght@400;500&display=swap' }
            ],
            script: [{ innerHTML: themeScript, tagPosition: 'head' }]
        }
    },
    nitro: {
        prerender: { crawlLinks: true, routes: ['/', '/sitemap.xml'] }
    }
})

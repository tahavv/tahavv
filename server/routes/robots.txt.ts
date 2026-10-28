// Production: everything public is crawlable, the sitemap is advertised.
// Any other deployment (Vercel previews): nothing is crawlable.
export default defineEventHandler((event) => {
    const { public: { siteUrl, indexable } } = useRuntimeConfig(event)
    setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
    if (!indexable) return 'User-agent: *\nDisallow: /\n'
    return `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${siteUrl}/sitemap.xml\n`
})

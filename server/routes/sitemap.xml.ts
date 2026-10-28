import { caseStudies } from '../../content/profile'

export default defineEventHandler((event) => {
    const { public: { siteUrl } } = useRuntimeConfig(event)
    const today = new Date().toISOString().slice(0, 10)
    const urls = [
        { loc: `${siteUrl}/`, priority: '1.0' },
        ...caseStudies.map((project) => ({ loc: `${siteUrl}/projects/${project.slug}`, priority: '0.8' }))
    ]
    const body = urls.map((url) => `  <url><loc>${url.loc}</loc><lastmod>${today}</lastmod><priority>${url.priority}</priority></url>`).join('\n')

    setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
})

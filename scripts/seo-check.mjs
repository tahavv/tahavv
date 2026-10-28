// SEO regression check. Build, start the production server, then run:
//   npm run build && npm run preview   (in one terminal)
//   npm run check:seo                  (in another; BASE_URL defaults to http://localhost:3000)
// It reads the sitemap, then checks every listed page, robots.txt, a missing page and every
// internal link. It exits with code 1 on any failure, so it can run in CI.
const base = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '')
const failures = []
const fail = (where, message) => failures.push(`${where}: ${message}`)

async function get(path) {
    const response = await fetch(base + path, { redirect: 'manual', headers: { accept: 'text/html,application/xhtml+xml,*/*' } })
    return { status: response.status, headers: response.headers, text: await response.text() }
}

const attr = (html, pattern) => html.match(pattern)?.[1]?.trim()
const meta = (html, key) => attr(html, new RegExp(`<meta[^>]+(?:name|property)="${key}"[^>]+content="([^"]*)"`, 'i'))
    ?? attr(html, new RegExp(`<meta[^>]+content="([^"]*)"[^>]+(?:name|property)="${key}"`, 'i'))

const robots = await get('/robots.txt')
if (robots.status !== 200) fail('/robots.txt', `status ${robots.status}`)
const sitemapLine = robots.text.match(/^Sitemap:\s*(\S+)/m)?.[1]
if (!/Disallow: \/$/m.test(robots.text) && !sitemapLine) fail('/robots.txt', 'no Sitemap line')

const sitemap = await get('/sitemap.xml')
if (sitemap.status !== 200) fail('/sitemap.xml', `status ${sitemap.status}`)
const locs = [...sitemap.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
if (!locs.length) fail('/sitemap.xml', 'no URLs')
const origin = locs[0] ? new URL(locs[0]).origin : base
if (sitemapLine && !sitemapLine.startsWith(origin)) fail('/robots.txt', `sitemap ${sitemapLine} is not on ${origin}`)

const links = new Set()
for (const loc of locs) {
    const path = new URL(loc).pathname
    const page = await get(path)
    const html = page.text
    if (page.status !== 200) { fail(path, `status ${page.status}`); continue }

    const title = attr(html, /<title>([^<]*)<\/title>/i)
    if (!title) fail(path, 'no <title>')
    else if (title.length > 70) fail(path, `title is ${title.length} characters (keep it under 70)`)

    const description = meta(html, 'description')
    if (!description) fail(path, 'no meta description')
    else if (description.length < 50 || description.length > 170) fail(path, `description is ${description.length} characters (50 to 170)`)

    const canonical = attr(html, /<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i) ?? attr(html, /<link[^>]+href="([^"]+)"[^>]+rel="canonical"/i)
    if (canonical !== loc) fail(path, `canonical ${canonical} should be ${loc}`)

    for (const key of ['og:title', 'og:description', 'og:url', 'og:image', 'twitter:card']) {
        if (!meta(html, key)) fail(path, `no ${key}`)
    }
    const image = meta(html, 'og:image')
    if (image && !/^https:\/\//.test(image)) fail(path, `og:image ${image} is not an absolute https URL`)
    if (meta(html, 'og:url') && meta(html, 'og:url') !== loc) fail(path, `og:url should be ${loc}`)

    const h1 = (html.match(/<h1[\s>]/gi) || []).length
    if (h1 !== 1) fail(path, `${h1} <h1> elements (expected 1)`)

    const blocks = [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)]
    if (!blocks.length) fail(path, 'no JSON-LD')
    for (const [, json] of blocks) {
        try {
            const data = JSON.parse(json)
            if (data['@context'] !== 'https://schema.org') fail(path, 'JSON-LD without the schema.org @context')
        } catch (error) { fail(path, `JSON-LD does not parse: ${error.message}`) }
    }

    for (const [, tag] of html.matchAll(/(<img\b[^>]*>)/gi)) {
        if (!/\balt="/i.test(tag)) fail(path, `image without alt: ${tag.slice(0, 80)}`)
    }
    if (/name="robots"[^>]+noindex/i.test(html) && !/Disallow: \/$/m.test(robots.text)) fail(path, 'noindex on a page listed in the sitemap')

    for (const [, href] of html.matchAll(/<a[^>]+href="(\/[^"#]*)/gi)) links.add(href)
}

for (const href of links) {
    if (!href || href.startsWith('/_')) continue
    const { status } = await get(href)
    if (status >= 400) fail(href, `internal link answers ${status}`)
}

const missing = await get('/this-page-does-not-exist')
if (missing.status !== 404) fail('/this-page-does-not-exist', `status ${missing.status} (expected 404)`)
if (!/noindex/i.test(missing.text)) fail('/this-page-does-not-exist', 'the 404 page is not noindex')

if (failures.length) {
    console.error(`SEO check failed (${failures.length}):\n - ${failures.join('\n - ')}`)
    process.exit(1)
}
console.log(`SEO check passed: ${locs.length} pages, ${links.size} internal links, robots.txt, sitemap.xml and the 404 page.`)

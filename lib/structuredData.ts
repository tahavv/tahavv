import type { BreadcrumbList, CreativeWork, Graph, ItemList, Person, ProfilePage, Thing, WebSite } from 'schema-dts'
import { certifications, education, experience, profile, projects, skills, type Project } from '~/content/profile'

// Schema.org JSON-LD for the site, typed with schema-dts. Every page publishes one @graph;
// the Person and the WebSite carry stable @ids so the pages point at the same entities.
export const ids = (siteUrl: string) => ({
    person: `${siteUrl}/#person`,
    website: `${siteUrl}/#website`
})

export function person(siteUrl: string): Person {
    return {
        '@type': 'Person',
        '@id': ids(siteUrl).person,
        name: profile.name,
        givenName: 'Taha',
        familyName: 'Ayari',
        jobTitle: profile.role,
        description: profile.summary,
        url: `${siteUrl}/`,
        image: `${siteUrl}${profile.image}`,
        email: `mailto:${profile.email}`,
        sameAs: [profile.github, profile.linkedin],
        address: { '@type': 'PostalAddress', addressLocality: 'Tunis', addressCountry: 'TN' },
        worksFor: [...new Set(experience.filter((role) => role.period.endsWith('now')).map((role) => role.company))]
            .map((name) => ({ '@type': 'Organization', name })),
        alumniOf: education.map((entry) => ({ '@type': 'CollegeOrUniversity', name: entry.school })),
        hasCredential: certifications.map((entry) => ({ '@type': 'EducationalOccupationalCredential', name: entry.name, url: entry.href })),
        knowsAbout: [...new Set(skills.flatMap((group) => group.items))]
    }
}

export function website(siteUrl: string): WebSite {
    return {
        '@type': 'WebSite',
        '@id': ids(siteUrl).website,
        url: `${siteUrl}/`,
        name: profile.name,
        description: profile.summary,
        inLanguage: 'en',
        publisher: { '@id': ids(siteUrl).person }
    }
}

export function homeGraph(siteUrl: string, title: string): Graph {
    const page: ProfilePage = {
        '@type': 'ProfilePage',
        '@id': `${siteUrl}/`,
        url: `${siteUrl}/`,
        name: title,
        inLanguage: 'en',
        isPartOf: { '@id': ids(siteUrl).website },
        mainEntity: { '@id': ids(siteUrl).person },
        primaryImageOfPage: `${siteUrl}/og.png`
    }
    const list: ItemList = {
        '@type': 'ItemList',
        name: 'Projects',
        itemListElement: projects.map((project, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: project.context ? `${siteUrl}/projects/${project.slug}` : project.repo,
            name: project.name
        }))
    }
    return { '@context': 'https://schema.org', '@graph': [website(siteUrl), page, person(siteUrl), list] as Thing[] }
}

export function projectGraph(siteUrl: string, project: Project): Graph {
    const url = `${siteUrl}/projects/${project.slug}`
    const work: CreativeWork = {
        '@type': 'CreativeWork',
        '@id': url,
        name: project.name,
        url,
        description: project.summary,
        keywords: project.stack.join(', '),
        inLanguage: 'en',
        image: `${siteUrl}/og.png`,
        isPartOf: { '@id': ids(siteUrl).website },
        author: { '@id': ids(siteUrl).person },
        sourceOrganization: { '@type': 'Organization', name: project.where }
    }
    const trail: BreadcrumbList = {
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: profile.name, item: `${siteUrl}/` },
            { '@type': 'ListItem', position: 2, name: 'Work', item: `${siteUrl}/#work` },
            { '@type': 'ListItem', position: 3, name: project.name, item: url }
        ]
    }
    return { '@context': 'https://schema.org', '@graph': [website(siteUrl), person(siteUrl), work, trail] as Thing[] }
}

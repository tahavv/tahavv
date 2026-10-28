<script setup lang="ts">
import { certifications, education, experience, profile, projects, skills } from '~/content/profile'

const { public: { siteUrl } } = useRuntimeConfig()
const title = 'Taha Ayari | Software Engineer, Cloud, DevOps and Full-Stack'
const description = 'Taha Ayari, software engineer in Tunis. Kubernetes, Terraform, Ansible, Argo CD, Prometheus and Grafana, with Angular, Spring Boot, Nuxt and Next.js. AWS and GCP.'

useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogType: 'profile',
    ogUrl: `${siteUrl}/`,
    ogImage: `${siteUrl}/og.png`,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageAlt: 'Taha Ayari, cloud and platform engineer',
    profileFirstName: 'Taha',
    profileLastName: 'Ayari',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: `${siteUrl}/og.png`,
    keywords: 'Taha Ayari, software engineer, DevOps engineer, cloud engineer, platform engineer, full-stack developer, Kubernetes, Terraform, Ansible, Argo CD, GitOps, Prometheus, Grafana, Quickwit, Jaeger, Jenkins, Docker, AWS, GCP, Angular, Spring Boot, Nuxt, Next.js, Vue.js, TypeScript, Tunis, Tunisia'
})

const person = {
    '@type': 'Person',
    '@id': `${siteUrl}/#person`,
    name: profile.name,
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

useHead({
    link: [{ rel: 'canonical', href: `${siteUrl}/` }],
    script: [{
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
                { '@type': 'ProfilePage', '@id': `${siteUrl}/`, url: `${siteUrl}/`, name: title, mainEntity: { '@id': `${siteUrl}/#person` } },
                person,
                {
                    '@type': 'ItemList',
                    name: 'Projects',
                    itemListElement: projects.map((project, index) => ({
                        '@type': 'ListItem',
                        position: index + 1,
                        url: project.context ? `${siteUrl}/projects/${project.slug}` : project.repo,
                        name: project.name
                    }))
                }
            ]
        })
    }]
})
</script>

<template>
    <HeroSection />
    <div id="about">
        <AboutStory />
    </div>
    <WorkShowcase />
    <ExperienceProcess />
    <NumbersDetail />
    <SkillsStack />
    <CredentialsSection />
    <ContactSection />
</template>
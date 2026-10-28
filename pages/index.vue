<script setup lang="ts">
import { homeGraph } from '~/lib/structuredData'

const { public: { siteUrl } } = useRuntimeConfig()
const title = 'Taha Ayari | Software Engineer, Full-Stack and Cloud'
const description = 'Taha Ayari, software engineer in Tunis with 3+ years shipping full-stack and cloud systems: Angular, Spring Boot, Nuxt, Docker, Kubernetes, CI/CD and GCP.'

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
    ogImageAlt: 'Taha Ayari, software engineer, full-stack and cloud',
    ogImageType: 'image/png',
    profileFirstName: 'Taha',
    profileLastName: 'Ayari',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: `${siteUrl}/og.png`,
    twitterImageAlt: 'Taha Ayari, software engineer, full-stack and cloud'
})

useHead({
    link: [{ rel: 'canonical', href: `${siteUrl}/` }],
    script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(homeGraph(siteUrl, title)) }]
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
<script setup lang="ts">
import { caseStudies, profile } from '~/content/profile'

const route = useRoute()
const project = caseStudies.find((item) => item.slug === route.params.slug)
if (!project) {
    throw createError({ statusCode: 404, statusMessage: 'Project not found', fatal: true })
}

const { public: { siteUrl } } = useRuntimeConfig()
const url = `${siteUrl}/projects/${project.slug}`
const title = `${project.name} | Taha Ayari`
const description = `${project.summary} ${project.where}, ${project.years}. ${project.stack.join(', ')}.`
const others = caseStudies.filter((item) => item.slug !== project.slug)

useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogType: 'article',
    ogUrl: url,
    ogImage: `${siteUrl}/og.png`,
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: `${siteUrl}/og.png`
})

useHead({
    link: [{ rel: 'canonical', href: url }],
    script: [{
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
                {
                    '@type': 'CreativeWork',
                    '@id': url,
                    name: project.name,
                    url,
                    description: project.summary,
                    keywords: project.stack.join(', '),
                    author: { '@type': 'Person', '@id': `${siteUrl}/#person`, name: profile.name, url: `${siteUrl}/` },
                    sourceOrganization: { '@type': 'Organization', name: project.where }
                },
                {
                    '@type': 'BreadcrumbList',
                    itemListElement: [
                        { '@type': 'ListItem', position: 1, name: 'Taha Ayari', item: `${siteUrl}/` },
                        { '@type': 'ListItem', position: 2, name: 'Work', item: `${siteUrl}/#work` },
                        { '@type': 'ListItem', position: 3, name: project.name, item: url }
                    ]
                }
            ]
        })
    }]
})
</script>

<template>
    <article class="case" aria-labelledby="case-title">
        <header class="section case__head" data-scene="plan" data-chapter="Case">
            <div class="container">
                <nav class="case__crumbs" aria-label="Breadcrumb">
                    <NuxtLink to="/#work">Work</NuxtLink>
                    <span aria-hidden="true">/</span>
                    <span aria-current="page">{{ project.where }}</span>
                </nav>
                <h1 id="case-title" class="case__title">{{ project.name }}</h1>
                <p class="lead">{{ project.summary }}</p>
                <dl class="case__meta">
                    <div><dt>Where</dt><dd>{{ project.where }}</dd></div>
                    <div><dt>When</dt><dd>{{ project.years }}</dd></div>
                    <div><dt>Stack</dt><dd>{{ project.stack.join(', ') }}</dd></div>
                </dl>
            </div>
        </header>

        <section class="sheet case__body" aria-labelledby="work-title" data-scene="white" data-chapter="The work">
            <div class="container">
                <h2 id="work-title" class="case__statement" data-reveal>{{ project.context }}</h2>
                <div class="case__grid" data-rise>
                    <div class="case__block card-white" data-tilt>
                        <h3>What I did</h3>
                        <ul class="case__list">
                            <li v-for="item in project.work" :key="item">{{ item }}</li>
                        </ul>
                    </div>
                    <div v-if="project.outcome" class="case__block card-white" data-tilt>
                        <h3>What changed</h3>
                        <ul class="case__list case__list--added">
                            <li v-for="item in project.outcome" :key="item">{{ item }}</li>
                        </ul>
                    </div>
                    <div v-else class="case__block card-white" data-tilt>
                        <h3>Built with</h3>
                        <ul class="case__list case__list--added">
                            <li v-for="item in project.stack" :key="item">{{ item }}</li>
                        </ul>
                    </div>
                    <p class="case__note">Client work: the code is private, so this page describes it instead of linking to it.</p>
                </div>
            </div>
        </section>

        <section class="section case__next" aria-labelledby="next-title" data-scene="field" data-chapter="More work">
            <div class="container">
                <h2 id="next-title">More work</h2>
                <ul class="case__others" data-rise>
                    <li v-for="item in others" :key="item.slug">
                        <NuxtLink class="card-white" :to="`/projects/${item.slug}`" data-tilt>
                            <span class="case__other-name">{{ item.name }}</span>
                            <span class="case__other-meta">{{ item.where }}, {{ item.years }}</span>
                        </NuxtLink>
                    </li>
                </ul>
                <div class="case__actions">
                    <NuxtLink class="btn btn--lead" to="/#contact">Get in touch</NuxtLink>
                    <a class="btn" :href="profile.cv" download>Download CV</a>
                </div>
            </div>
        </section>
    </article>
</template>

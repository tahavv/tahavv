<script setup lang="ts">
import { gsap } from 'gsap'
import { caseStudies, projects } from '~/content/profile'
import { withIcons } from '~/content/icons'

// The work chapter, on a light floor and pinned: one platform at a time, its screen
// swinging in from the right while its story takes the left.
const root = ref<HTMLElement | null>(null)
const active = shallowRef(0)
const repositories = projects.filter((project) => !project.context)
const total = caseStudies.length

usePinnedTimeline(root, total, (timeline) => {
    const texts = gsap.utils.toArray<HTMLElement>('.work__text')
    const screens = gsap.utils.toArray<HTMLElement>('.screen')
    gsap.set(texts.slice(1), { opacity: 0, y: 60 })
    gsap.set(screens.slice(1), { opacity: 0, xPercent: 90, rotateY: -55, rotateX: 12 })
    timeline.fromTo(screens[0], { opacity: 0, xPercent: 60, rotateY: -45 }, { opacity: 1, xPercent: 0, rotateY: -16, rotateX: 6, duration: 0.6, ease: 'power2.out' })
    for (let i = 1; i < total; i += 1) {
        // The old pair leaves together; the new pair arrives together as the old text clears.
        const step = `step${i}`
        timeline
            .addLabel(step, '+=0.35')
            .to(texts[i - 1], { opacity: 0, y: -60, duration: 0.3 }, step)
            .to(screens[i - 1], { opacity: 0, xPercent: -110, rotateY: 35, rotateX: 4, duration: 0.6, ease: 'power2.in' }, step)
            .to(screens[i], { opacity: 1, xPercent: 0, rotateY: -16, rotateX: 6, duration: 0.6, ease: 'power2.out' }, `${step}+=0.25`)
            .to(texts[i], { opacity: 1, y: 0, duration: 0.35 }, `${step}+=0.3`)
    }
    timeline.to({}, { duration: 0.35 })
}, (progress) => { active.value = Math.min(total - 1, Math.floor(progress * total)) })
</script>

<template>
    <section id="work" class="sheet work" aria-labelledby="work-title" data-chapter="Work">
        <div class="container work__intro">
            <ChapterLabel no="02" name="Work" />
            <h2 id="work-title" data-reveal>Five platforms, in production</h2>
            <p data-reveal>Built and run at Everbloo and Elite Business. Scroll through them, or open one for the problem, the work and what changed.</p>
        </div>

        <div ref="root" class="work__stage" data-scene="away">
            <div class="stage-floor" aria-hidden="true"></div>
            <div class="container work__grid">
                <div class="work__texts">
                    <article v-for="(project, index) in caseStudies" :key="project.slug" class="work__text">
                        <p class="work__meta"><span class="work__index">{{ String(index + 1).padStart(2, '0') }}</span>{{ project.where }}, {{ project.years }}</p>
                        <h3>{{ project.name }}</h3>
                        <p>{{ project.summary }}</p>
                        <p class="work__stack">{{ project.stack.join(', ') }}</p>
                        <NuxtLink class="btn btn--lead btn--small" :to="`/projects/${project.slug}`">Open the case</NuxtLink>
                    </article>
                </div>
                <div class="work__screens">
                    <NuxtLink
                        v-for="(project, index) in caseStudies"
                        :key="project.slug"
                        class="screen"
                        :class="`screen--${index + 1}`"
                        :to="`/projects/${project.slug}`"
                        :aria-label="`Open the case: ${project.name}`"
                    >
                        <span class="screen__bar"><span>{{ project.where }}</span><span>{{ project.years }}</span></span>
                        <span class="screen__title">{{ project.name }}</span>
                        <span class="screen__icons">
                            <IconTile v-for="name in withIcons(project.stack, 5)" :key="name" :name="name" size="md" />
                        </span>
                        <span class="screen__foot">{{ project.outcome?.[0] || project.summary }}</span>
                    </NuxtLink>
                </div>
            </div>
            <p class="work__count" aria-hidden="true"><b>{{ String(active + 1).padStart(2, '0') }}</b> / {{ String(total).padStart(2, '0') }}</p>
        </div>

        <div class="container work__repos">
            <h3 data-reveal>Public repositories</h3>
            <ul class="repos" data-rise>
                <li v-for="repo in repositories" :key="repo.slug">
                    <a class="repo" :href="repo.repo" rel="noreferrer" target="_blank" data-tilt>
                        <span class="repo__art"><IconTile :name="withIcons(repo.stack, 1)[0] || 'Git'" size="md" /></span>
                        <span class="repo__name">{{ repo.name }}</span>
                        <span class="repo__line">{{ repo.summary }}</span>
                        <span class="repo__stack">{{ repo.stack.slice(0, 4).join(', ') }}</span>
                        <span class="repo__more">View on GitHub</span>
                    </a>
                </li>
            </ul>
        </div>
    </section>
</template>

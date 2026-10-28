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

usePinnedTimeline(root, total, (timeline, element) => {
    const select = gsap.utils.selector(element)
    const texts = select<HTMLElement>('.work__text')
    const screens = select<HTMLElement>('.screen')
    gsap.set(screens.slice(1), { opacity: 0, xPercent: 110, rotateY: -58, rotateX: 12 })
    timeline.fromTo(screens[0], { opacity: 0, xPercent: -105, rotateY: 52, rotateX: 10 }, { opacity: 1, xPercent: 0, rotateY: -12, rotateX: 5, duration: 0.7, ease: 'power3.out' })
    for (let i = 1; i < total; i += 1) {
        // Alternate directions so the pinned chapter reads as a lateral carousel,
        // rather than a stack of cards repeatedly entering from the right.
        const step = `step${i}`
        const enteringFrom = i % 2 === 0 ? -115 : 115
        const leavingTo = -enteringFrom
        const enteringTilt = enteringFrom > 0 ? -58 : 58
        const leavingTilt = leavingTo > 0 ? -48 : 48
        timeline
            .addLabel(step, '+=0.35')
            .to(screens[i - 1], { opacity: 0, xPercent: leavingTo, rotateY: leavingTilt, rotateX: 5, duration: 0.62, ease: 'power2.in' }, step)
            .fromTo(screens[i], { opacity: 0, xPercent: enteringFrom, rotateY: enteringTilt, rotateX: 12 }, { opacity: 1, xPercent: 0, rotateY: -12, rotateX: 5, duration: 0.68, ease: 'power3.out' }, `${step}+=0.18`)
    }
    timeline.to({}, { duration: 0.35 })
    // The stories are beats: each one hands over at the moment its screen starts to swing.
    const length = timeline.duration()
    texts.forEach((text, i) => {
        if (i) text.dataset.in = String((timeline.labels[`step${i}`] + 0.3) / length)
        if (i < total - 1) text.dataset.out = String(timeline.labels[`step${i + 1}`] / length)
    })
}, (progress) => { active.value = Math.min(total - 1, Math.floor(progress * total)) })

// Over the screens, an "Open the case" chip trails the pointer, as the reference's exhibit cursor does.
const chip = ref<HTMLElement | null>(null)
let chipContext: gsap.Context | undefined

onMounted(() => {
    if (!chip.value || !root.value || !matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return
    const element = chip.value
    chipContext = gsap.context(() => {
        const x = gsap.quickTo(element, 'x', { duration: 0.5, ease: 'power3.out' })
        const y = gsap.quickTo(element, 'y', { duration: 0.5, ease: 'power3.out' })
        const screens = root.value!.querySelector<HTMLElement>('.work__screens')
        screens?.addEventListener('pointermove', (event) => {
            x(event.clientX + 16)
            y(event.clientY + 16)
        })
        screens?.addEventListener('pointerenter', (event) => {
            gsap.set(element, { x: event.clientX + 16, y: event.clientY + 16 })
            element.classList.add('is-on')
        })
        screens?.addEventListener('pointerleave', () => element.classList.remove('is-on'))
    })
})

onBeforeUnmount(() => chipContext?.revert())
</script>

<template>
    <section id="work" class="sheet work" aria-labelledby="work-title" data-chapter="Work" data-scene="white">
        <div class="container work__intro">
            <ChapterLabel no="02" name="Work" />
            <h2 id="work-title" data-chars>Five platforms, in production</h2>
            <p data-reveal>Real systems I built and run at Everbloo-Adenis and Elite Business, used by operations teams and by clients across international markets. Open any one for the problem, my part and the result.</p>
        </div>

        <div ref="root" class="work__stage" data-scene="valley">
            <div class="stage-floor" aria-hidden="true"></div>
            <div class="container work__grid">
                <div class="work__texts">
                    <article
                        v-for="(project, index) in caseStudies"
                        :key="project.slug"
                        class="work__text"
                        :data-in="index / total"
                        :data-out="index < total - 1 ? (index + 1) / total : undefined"
                    >
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
            <span ref="chip" class="exhibit-cursor" aria-hidden="true"><span>Open the case</span></span>
            <p class="work__count" aria-hidden="true"><b>{{ String(active + 1).padStart(2, '0') }}</b> / {{ String(total).padStart(2, '0') }}</p>
        </div>

        <div class="container work__repos">
            <h3 data-reveal>Side projects on GitHub</h3>
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

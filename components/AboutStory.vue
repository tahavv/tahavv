<script setup lang="ts">
import { pillars } from '~/content/profile'

// The about chapter, pinned: the statement comes into focus, gives way to the result,
// then three cards rise out of the floor.
const root = ref<HTMLElement | null>(null)
const words = 'Software, and the platform it runs on.'.split(' ')

usePinnedTimeline(root, 3.2, (timeline) => {
    timeline
        .fromTo('.about__word', { opacity: 0.08, filter: 'blur(12px)', y: 24 }, { opacity: 1, filter: 'blur(0px)', y: 0, stagger: 0.08, duration: 0.8 })
        .from('.about__sub', { opacity: 0, y: 20, duration: 0.3 }, '<0.5')
        .to('.about__statement', { opacity: 0, y: -80, duration: 0.4 }, '+=0.3')
        .fromTo('.about__closing', { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.4 }, '<0.1')
        .fromTo('.about__mark', { '--mark': 0 }, { '--mark': 1, duration: 0.4 })
        .to('.about__closing', { opacity: 0, y: -80, duration: 0.4 }, '+=0.3')
        .fromTo('.about__cards > li', { y: '70vh', rotateX: -35, opacity: 0 }, { y: 0, rotateX: 0, opacity: 1, stagger: 0.15, duration: 0.9, ease: 'power2.out' }, '<0.1')
        .to({}, { duration: 0.4 })
})
</script>

<template>
    <section ref="root" class="about" aria-labelledby="about-title" data-scene="ring" data-chapter="About">
        <div class="container about__stage">
            <div class="about__statement">
                <ChapterLabel no="01" name="About" />
                <h2 id="about-title" class="about__title">
                    <template v-for="(word, w) in words" :key="w"><span class="about__word">{{ word }}</span>{{ ' ' }}</template>
                </h2>
                <p class="about__sub">I write the code, then build the platform that ships it: clusters, pipelines, dashboards and the services on top.</p>
            </div>
            <p class="about__closing">Releases went from monthly to <span class="about__mark">weekly</span>.</p>
            <ul class="about__cards">
                <li v-for="(pillar, index) in pillars" :key="pillar.title">
                    <a class="pillar" href="#skills" data-tilt>
                        <span class="pillar__art">
                            <span class="pillar__no">{{ String(index + 1).padStart(2, '0') }}</span>
                            <IconTile :name="pillar.icon" size="lg" />
                        </span>
                        <span class="pillar__body">
                            <span class="pillar__title">{{ pillar.title }}</span>
                            <span class="pillar__line">{{ pillar.line }}</span>
                            <span class="pillar__tags"><span v-for="tag in pillar.tags" :key="tag">{{ tag }}</span></span>
                            <span class="pillar__more">See the stack</span>
                        </span>
                    </a>
                </li>
            </ul>
        </div>
    </section>
</template>

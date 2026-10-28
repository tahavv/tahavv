<script setup lang="ts">
import { gsap } from 'gsap'
import { pillars } from '~/content/profile'

// The about chapter, pinned, in three beats: the statement, the result, three cards.
// The beats crossfade on their data-in/data-out windows; the timeline only scrubs the
// words into focus and draws the highlight, inside the first two windows.
const root = ref<HTMLElement | null>(null)
const words = 'From the first line of code to production.'.split(' ')

usePinnedTimeline(root, 3.4, (timeline, element) => {
    const select = gsap.utils.selector(element)
    timeline
        .fromTo(select('.about__word'), { opacity: 0, filter: 'blur(8px)', y: '0.3em' }, { opacity: 1, filter: 'blur(0px)', y: 0, stagger: 0.08, duration: 0.7 })
        .fromTo(select('.about__mark'), { '--mark': 0 }, { '--mark': 1, duration: 0.45, ease: 'power2.inOut' }, 1.75)
        .to({}, { duration: 1.8 })
})
</script>

<template>
    <section ref="root" class="about" aria-labelledby="about-title" data-scene="halo" data-chapter="About">
        <div class="container about__stage">
            <div class="about__statement" data-in="0" data-out="0.36">
                <ChapterLabel no="01" name="About" />
                <h2 id="about-title" class="about__title">
                    <template v-for="(word, w) in words" :key="w"><span class="about__word">{{ word }}</span>{{ ' ' }}</template>
                </h2>
                <p class="about__sub">A full-stack engineer with a DevOps mindset. I build the features, then the pipelines, clusters and dashboards that get them to users and keep them healthy. I own what I ship.</p>
            </div>
            <p class="about__closing" data-in="0.4" data-out="0.64">I took releases from monthly to <span class="about__mark">weekly</span>.</p>
            <ul class="about__cards" data-in="0.68">
                <li v-for="(pillar, index) in pillars" :key="pillar.title" :style="{ '--i': index }">
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

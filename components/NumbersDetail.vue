<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { scores } from '~/content/profile'

// The numbers: one result inside a selection box that draws itself, then the figures.
const root = ref<HTMLElement | null>(null)
let context: gsap.Context | undefined

function parts(figure: string) {
    return figure.split(/(\d+)/).filter(Boolean).map((part) => ({ part, number: /^\d+$/.test(part) }))
}

onMounted(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.registerPlugin(ScrollTrigger)
    context = gsap.context(() => {
        const trigger = { trigger: '.detail__box', start: 'top 85%', end: 'top 35%', scrub: 0.8 }
        gsap.fromTo('.detail__frame', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', ease: 'none', scrollTrigger: trigger })
        gsap.fromTo('.detail__handle', { scale: 0 }, { scale: 1, stagger: 0.1, ease: 'back.out(3)', scrollTrigger: trigger })
        gsap.fromTo('.detail__statement', { opacity: 0.1, y: 40 }, { opacity: 1, y: 0, ease: 'none', scrollTrigger: trigger })
    }, root.value ?? undefined)
})

onBeforeUnmount(() => context?.revert())
</script>

<template>
    <section ref="root" class="section detail" aria-labelledby="numbers-title" data-scene="open" data-chapter="Numbers">
        <div class="container detail__inner">
            <ChapterLabel no="04" name="Numbers" />
            <div class="detail__box">
                <span class="detail__frame" aria-hidden="true"></span>
                <span v-for="corner in ['tl', 'tr', 'bl', 'br']" :key="corner" class="detail__handle" :class="`detail__handle--${corner}`" aria-hidden="true"></span>
                <span class="detail__tag" aria-hidden="true">Elite Business</span>
                <h2 id="numbers-title" class="detail__statement" data-chars>Monthly to weekly releases.</h2>
            </div>
            <p class="detail__source">Release automation on Jenkins, Docker and Kubernetes. The rest, from my CV:</p>
            <dl class="figures" data-rise>
                <div v-for="score in scores" :key="score.unit" class="figure-cell">
                    <dd class="figure-cell__value">
                        <template v-for="(bit, i) in parts(score.figure)" :key="i">
                            <span v-if="bit.number" :data-count="bit.part">{{ bit.part }}</span><span v-else>{{ bit.part }}</span>
                        </template>
                        <span class="figure-cell__unit">{{ score.unit }}</span>
                    </dd>
                    <dt>{{ score.label }}</dt>
                </div>
            </dl>
        </div>
    </section>
</template>

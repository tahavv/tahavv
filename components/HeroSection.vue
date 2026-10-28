<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { profile } from '~/content/profile'

const root = ref<HTMLElement | null>(null)
let context: gsap.Context | undefined

onMounted(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.registerPlugin(ScrollTrigger)
    context = gsap.context(() => {
        gsap.from('[data-line]', { yPercent: 115, duration: 1.4, ease: 'power4.out', stagger: 0.1, delay: 0.25 })
        gsap.from('.hero__tag, .hero__aside > *', { y: 24, opacity: 0, duration: 1.1, ease: 'power3.out', stagger: 0.08, delay: 0.7 })
        // The first screen sinks away as the reader leaves it.
        gsap.to('.hero__inner', { yPercent: -25, opacity: 0, ease: 'none', scrollTrigger: { trigger: root.value, start: 'top top', end: 'bottom 20%', scrub: true } })
    }, root.value ?? undefined)
})

onBeforeUnmount(() => context?.revert())
</script>

<template>
    <section ref="root" class="hero" aria-labelledby="hero-title" data-scene="hero" data-chapter="Welcome">
        <div class="container hero__inner">
            <p class="hero__tag">Software engineer in {{ profile.location }}</p>
            <div class="hero__grid">
                <h1 id="hero-title" class="hero__title">
                    <span class="line"><span data-line>Cloud and platform,</span></span>
                    <span class="line"><span data-line>engineered.</span></span>
                </h1>
                <div class="hero__aside">
                    <p class="hero__lead"><strong>{{ profile.name }}.</strong> I build software and the Kubernetes, Terraform and GitOps platform under it.</p>
                    <div class="hero__actions">
                        <a class="btn btn--lead" href="#work">See the work</a>
                        <a class="btn btn--ghost" href="#contact">Get in touch</a>
                    </div>
                </div>
            </div>
        </div>
        <p class="hero__scroll" aria-hidden="true"><span></span>Scroll</p>
    </section>
</template>

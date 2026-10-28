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
        // Each letter rises out of a blur, as the reference's opening line does.
        const chars = gsap.utils.toArray<HTMLElement>('[data-line]').flatMap(splitChars)
        gsap.from(chars, { yPercent: 100, opacity: 0, filter: 'blur(6px)', duration: 1.4, ease: 'power2.out', stagger: 0.022, delay: 0.25 })
        gsap.from('.hero__tag, .hero__aside > *', { y: 24, opacity: 0, duration: 1.1, ease: 'power3.out', stagger: 0.08, delay: 0.7 })
        // The first screen sinks away as the reader leaves it.
        gsap.to('.hero__inner', { yPercent: -25, opacity: 0, ease: 'none', scrollTrigger: { trigger: root.value, start: 'top top', end: 'bottom 20%', scrub: true } })
    }, root.value ?? undefined)
})

onBeforeUnmount(() => context?.revert())
</script>

<template>
    <section ref="root" class="hero" aria-labelledby="hero-title" data-scene="ramp" data-chapter="Welcome">
        <div class="container hero__inner">
            <p class="hero__tag pixel-glitch">Software Engineer · Full-Stack &amp; Cloud · {{ profile.location }}</p>
            <div class="hero__grid">
                <h1 id="hero-title" class="hero__title">
                    <span class="line"><span data-line>Hi, I’m Taha.</span></span>
                    <span class="line"><span class="glitch" data-text="I build it, then I ship it." aria-hidden="true"><span data-line>I build it, then I ship it.</span></span><span class="sr-only">I build it, then I ship it.</span></span>
                </h1>
                <div class="hero__aside">
                    <p class="hero__lead"><strong>3+ years</strong> building production systems in travel tech and telecom: Angular, React and Nuxt front ends, Spring Boot and Node services, and the <strong>Docker, Kubernetes and CI/CD</strong> pipelines that ship them. Red Hat certified (RHCSA).</p>
                    <TerminalIntro />
                    <div class="hero__actions">
                        <a class="btn btn--lead" href="#work">See my work</a>
                        <a class="btn btn--ghost" :href="profile.cv" download>Download CV</a>
                    </div>
                </div>
            </div>
        </div>
        <p class="hero__scroll" aria-hidden="true"><span></span>Scroll</p>
    </section>
</template>

<style scoped>
.glitch {
    position: relative;
    display: inline-block;
    isolation: isolate;
}

.glitch::before,
.glitch::after {
    position: absolute;
    inset: 0;
    z-index: -1;
    content: attr(data-text);
    opacity: 0;
    pointer-events: none;
}

.glitch::before { color: #4cc9ff; animation: glitch-cyan 5.2s steps(1, end) infinite; }
.glitch::after { color: #a787ff; animation: glitch-violet 5.2s steps(1, end) infinite; }

.pixel-glitch { animation: pixel-shift 8.4s steps(1, end) infinite; }

.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

@keyframes glitch-cyan {
    0%, 89%, 100% { opacity: 0; transform: translate(0); clip-path: inset(0); }
    90% { opacity: 0.72; transform: translate(-0.045em, -0.02em); clip-path: inset(8% 0 74% 0); }
    92% { opacity: 0.55; transform: translate(0.06em, 0.02em); clip-path: inset(56% 0 21% 0); }
    94% { opacity: 0; }
}

@keyframes glitch-violet {
    0%, 90%, 100% { opacity: 0; transform: translate(0); clip-path: inset(0); }
    91% { opacity: 0.62; transform: translate(0.05em, 0.025em); clip-path: inset(32% 0 48% 0); }
    93% { opacity: 0.45; transform: translate(-0.03em, -0.03em); clip-path: inset(76% 0 7% 0); }
    95% { opacity: 0; }
}

@keyframes pixel-shift {
    0%, 86%, 100% { filter: none; text-shadow: none; transform: translate(0); }
    87% { filter: contrast(1.25); text-shadow: -2px 0 #35c4ff, 2px 0 #be77ff; transform: translateX(-1px); }
    88% { filter: contrast(1.5); text-shadow: 3px 0 #35c4ff, -2px 0 #be77ff; transform: translateX(2px); }
    89% { filter: none; text-shadow: none; transform: translate(0); }
}

@media (prefers-reduced-motion: reduce) {
    .glitch::before,
    .glitch::after,
    .pixel-glitch { animation: none; }
}
</style>

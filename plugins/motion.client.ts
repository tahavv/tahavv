import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import 'lenis/dist/lenis.css'

// Smooth scroll, scroll velocity for the 3D world, and the small scroll effects
// (reveals, counters, pointer tilt). The pinned chapters run their own timelines.
// Under reduced motion none of it runs: native scroll, every element in its final state.
export default defineNuxtPlugin((nuxtApp) => {
    gsap.registerPlugin(ScrollTrigger)
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const fine = matchMedia('(pointer: fine)').matches
    const state = { velocity: 0, reduced }
    let lenis: Lenis | null = null

    if (!reduced) {
        lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, anchors: { offset: -64, duration: 1.6 } })
        lenis.on('scroll', (instance: Lenis) => {
            state.velocity = instance.velocity
            ScrollTrigger.update()
        })
        gsap.ticker.add((time) => lenis?.raf(time * 1000))
        gsap.ticker.lagSmoothing(0)
    }

    // The world re-reads where the chapters are whenever pins change the layout.
    ScrollTrigger.addEventListener('refresh', () => window.dispatchEvent(new Event('chapters:refresh')))

    function scrollTo(target: string | number) {
        if (lenis) lenis.scrollTo(target, { offset: -64, duration: 1.6 })
        else if (typeof target === 'string') document.querySelector(target)?.scrollIntoView()
        else window.scrollTo(0, target)
    }

    function once(selector: string, run: (element: HTMLElement) => void) {
        gsap.utils.toArray<HTMLElement>(selector).forEach((element) => {
            if (element.dataset.motionBound) return
            element.dataset.motionBound = '1'
            run(element)
        })
    }

    function bind() {
        if (reduced) return
        once('[data-reveal]', (element) => {
            gsap.from(element, { y: 70, opacity: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 90%', once: true } })
        })
        // Cards rise out of the page as the reader scrolls toward them, scrubbed so they move with the scroll.
        once('[data-rise]', (group) => {
            gsap.fromTo(group.children, { y: 160, rotateX: -28, opacity: 0, transformOrigin: '50% 100%' }, {
                y: 0, rotateX: 0, opacity: 1, ease: 'power2.out', stagger: 0.12,
                scrollTrigger: { trigger: group, start: 'top 98%', end: 'top 45%', scrub: 0.6 }
            })
        })
        once('[data-count]', (element) => {
            const target = Number(element.dataset.count)
            const counter = { value: 0 }
            element.textContent = '0'
            gsap.to(counter, {
                value: target, duration: 1.8, ease: 'power2.out',
                onUpdate: () => { element.textContent = String(Math.round(counter.value)) },
                scrollTrigger: { trigger: element, start: 'top 90%', once: true }
            })
        })
        if (fine) {
            once('[data-tilt]', (card) => {
                card.addEventListener('pointermove', (event) => {
                    const box = card.getBoundingClientRect()
                    const x = (event.clientX - box.left) / box.width - 0.5
                    const y = (event.clientY - box.top) / box.height - 0.5
                    gsap.to(card, { rotateY: x * 8, rotateX: -y * 8, y: -6, transformPerspective: 1000, duration: 0.6, ease: 'power3.out' })
                })
                card.addEventListener('pointerleave', () => gsap.to(card, { rotateY: 0, rotateX: 0, y: 0, duration: 0.9, ease: 'power3.out' }))
            })
        }
    }

    nuxtApp.hook('page:finish', () => {
        requestAnimationFrame(() => {
            bind()
            ScrollTrigger.refresh()
        })
    })

    return { provide: { motion: { scrollTo, state, reduced } } }
})

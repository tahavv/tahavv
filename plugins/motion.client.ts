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
    const state = { velocity: 0, reduced, paused: false }
    let lenis: Lenis | null = null

    if (!reduced) {
        lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 })
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
        if (lenis) lenis.scrollTo(target, { duration: 1.6 })
        else if (typeof target === 'string') document.querySelector(target)?.scrollIntoView()
        else window.scrollTo(0, target)
    }

    // Chapter jumps go through the pixel wave: cover, move instantly, uncover.
    // A pinned chapter is measured on its pin spacer, which keeps its place in the flow.
    function jump(target: HTMLElement, from?: { x: number, y: number }) {
        const anchor = target.parentElement?.classList.contains('pin-spacer') ? target.parentElement : target
        const move = () => {
            const top = anchor.getBoundingClientRect().top + window.scrollY
            if (lenis) lenis.scrollTo(top, { immediate: true, force: true })
            else window.scrollTo(0, top)
            ScrollTrigger.update()
            // The 3D world lands on the new chapter's frame at once, under the wave.
            window.dispatchEvent(new Event('motion:jump'))
        }
        if (reduced) move()
        else pixelWave(move, from)
    }

    // Every same-page #chapter link takes the jump, the nav's included.
    document.addEventListener('click', (event) => {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
        const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href*="#"]')
        if (!link) return
        const url = new URL(link.href, window.location.href)
        if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || url.hash.length < 2) return
        const target = document.getElementById(decodeURIComponent(url.hash.slice(1)))
        if (!target) return
        event.preventDefault()
        jump(target, { x: event.clientX, y: event.clientY })
        history.replaceState(history.state, '', url.hash)
    }, true)

    // Keep every scroll-driven effect and the smooth-scroll engine in the same
    // state as the visible "Pause motion" control. The 3D world observes the
    // shared Vue state separately, so it stops on the same interaction.
    function setPaused(value: boolean) {
        if (reduced || state.paused === value) return
        state.paused = value
        if (value) {
            lenis?.stop()
            gsap.globalTimeline.pause()
            return
        }
        gsap.globalTimeline.resume()
        lenis?.start()
        requestAnimationFrame(() => ScrollTrigger.refresh())
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
        // The reference's fade: a short 36px climb on a long expo ease, opacity settling first.
        once('[data-reveal]', (element) => {
            gsap.from(element, { y: 36, opacity: 0, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: element, start: 'top 88%', once: true } })
        })
        // Headings emerge letter by letter: each one climbs out of its own line through a blur.
        once('[data-chars]', (element) => {
            gsap.from(splitChars(element), {
                yPercent: 100, opacity: 0, filter: 'blur(6px)', duration: 1.4, ease: 'power2.out', stagger: 0.018,
                scrollTrigger: { trigger: element, start: 'top 85%', once: true }
            })
        })
        // Chapter chips wipe in from the top through a gradient mask (CSS does the wipe).
        once('.chapter-label', (element) => {
            ScrollTrigger.create({ trigger: element, start: 'top 92%', once: true, onEnter: () => element.classList.add('is-in') })
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

    return { provide: { motion: { scrollTo, jump, setPaused, state, reduced } } }
})

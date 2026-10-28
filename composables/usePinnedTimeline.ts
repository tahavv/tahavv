import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Ref } from 'vue'

// Pin a chapter for `length` screens and scrub a timeline through it. Without motion
// (reduced motion, no script) nothing is pinned and the chapter reads as a plain list,
// because its markup is laid out in flow until `is-pinned` is added here.
export function usePinnedTimeline(
    root: Ref<HTMLElement | null>,
    length: number,
    build: (timeline: gsap.core.Timeline, element: HTMLElement) => void,
    onProgress?: (progress: number) => void
) {
    let context: gsap.Context | undefined

    onMounted(() => {
        const element = root.value
        if (!element || matchMedia('(prefers-reduced-motion: reduce)').matches) return
        gsap.registerPlugin(ScrollTrigger)
        element.classList.add('is-pinned')
        context = gsap.context(() => {
            const timeline = gsap.timeline({
                defaults: { ease: 'none' },
                scrollTrigger: {
                    trigger: element,
                    start: 'top top',
                    end: `+=${length * 100}%`,
                    pin: true,
                    scrub: 0.8,
                    anticipatePin: 1,
                    onUpdate: (self) => onProgress?.(self.progress)
                }
            })
            build(timeline, element)
        }, element)
        requestAnimationFrame(() => ScrollTrigger.refresh())
    })

    onBeforeUnmount(() => {
        context?.revert()
        root.value?.classList.remove('is-pinned')
    })
}

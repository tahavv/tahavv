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
        // Pins require a stable, single-screen composition. On narrow layouts
        // the same content reads more reliably as an ordinary document flow.
        if (!element || matchMedia('(prefers-reduced-motion: reduce), (max-width: 60rem)').matches) return
        gsap.registerPlugin(ScrollTrigger)
        element.classList.add('is-pinned')
        // Beats, after the reference: a layer marked data-in/data-out is on while the pin's
        // progress sits inside that window. The scroll only picks the beat; CSS plays the
        // crossfade at its own pace, so a layer never freezes half-faded mid-scroll.
        const layers = [...element.querySelectorAll<HTMLElement>('[data-in]')]
        const beats = (progress: number) => layers.forEach((layer) => {
            const enter = Number(layer.dataset.in)
            const leave = Number(layer.dataset.out ?? 2)
            layer.classList.toggle('is-in', progress >= enter && progress < leave)
            layer.classList.toggle('is-past', progress >= leave)
        })
        beats(0)
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
                    onUpdate: (self) => {
                        beats(self.progress)
                        onProgress?.(self.progress)
                    },
                    onRefresh: (self) => beats(self.progress)
                }
            })
            build(timeline, element)
        }, element)
        requestAnimationFrame(() => ScrollTrigger.refresh())
    })

    onBeforeUnmount(() => {
        context?.revert()
        root.value?.classList.remove('is-pinned')
        root.value?.querySelectorAll('[data-in]').forEach((layer) => layer.classList.remove('is-in', 'is-past'))
    })
}

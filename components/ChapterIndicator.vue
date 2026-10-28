<script setup lang="ts">
// A running head at the bottom left: which chapter the reader is in, and how far down the page.
// On the right, the reference's chapter dots: one mark per chapter, the current one drawn long.
const chapters = ref<string[]>([])
const current = shallowRef(0)
const progress = shallowRef(0)
const light = shallowRef(false)
const { $motion } = useNuxtApp()
let frame = 0

function read() {
    chapters.value = [...document.querySelectorAll<HTMLElement>('[data-chapter]')].map((element) => element.dataset.chapter || '')
}

function update() {
    frame = 0
    const middle = window.innerHeight * 0.5
    const elements = document.querySelectorAll<HTMLElement>('[data-chapter]')
    let index = 0
    elements.forEach((element, i) => { if (element.getBoundingClientRect().top <= middle) index = i })
    current.value = index
    // The 3D world decides day and night (world:light). Without it, a pale sheet in the middle of the screen does.
    if (!document.documentElement.classList.contains('has-world')) {
        light.value = [...document.querySelectorAll<HTMLElement>('.sheet')].some((element) => {
            const box = element.getBoundingClientRect()
            return box.top < middle && box.bottom > middle
        })
        document.documentElement.classList.toggle('is-light', light.value)
    }
    const max = document.documentElement.scrollHeight - window.innerHeight
    progress.value = max > 0 ? window.scrollY / max : 0
}

function go(event: MouseEvent, index: number) {
    const element = document.querySelectorAll<HTMLElement>('[data-chapter]')[index]
    if (!element) return
    if ($motion) $motion.jump(element, { x: event.clientX, y: event.clientY })
    else element.scrollIntoView()
}

const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
const onRefresh = () => { read(); update() }
const onLight = (event: Event) => { light.value = (event as CustomEvent<boolean>).detail }

onMounted(() => {
    onRefresh()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('chapters:refresh', onRefresh)
    window.addEventListener('world:light', onLight)
})

onBeforeUnmount(() => {
    document.documentElement.classList.remove('is-light')
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('chapters:refresh', onRefresh)
    window.removeEventListener('world:light', onLight)
    cancelAnimationFrame(frame)
})
</script>

<template>
    <div class="progress" aria-hidden="true">
        <span :style="{ transform: `scaleX(${progress})` }"></span>
    </div>
    <div v-if="chapters.length" class="chapter" aria-hidden="true">
        <span class="chapter__no">{{ String(current + 1).padStart(2, '0') }}</span>
        <span class="chapter__text">
            <span class="chapter__kicker">Chapter</span>
            <span class="chapter__name">
                <Transition name="chapter" mode="out-in">
                    <span :key="current">{{ chapters[current] }}</span>
                </Transition>
            </span>
        </span>
    </div>
    <nav v-if="chapters.length" class="dots" :class="{ 'is-light': light }" aria-label="Chapters">
        <button
            v-for="(name, index) in chapters"
            :key="name"
            class="dots__item"
            :class="{ 'is-active': index === current }"
            type="button"
            :aria-current="index === current ? 'true' : undefined"
            @click="go($event, index)"
        >
            <span class="dots__name">{{ String(index + 1).padStart(2, '0') }} {{ name }}</span>
            <span class="dots__mark" aria-hidden="true"></span>
        </button>
    </nav>
</template>

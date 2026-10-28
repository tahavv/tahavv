<script setup lang="ts">
// A running head at the bottom left: which chapter the reader is in, and how far down the page.
const chapters = ref<string[]>([])
const current = shallowRef(0)
const progress = shallowRef(0)
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
    const max = document.documentElement.scrollHeight - window.innerHeight
    progress.value = max > 0 ? window.scrollY / max : 0
}

const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
const onRefresh = () => { read(); update() }

onMounted(() => {
    onRefresh()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('chapters:refresh', onRefresh)
})

onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('chapters:refresh', onRefresh)
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
    </div></template>

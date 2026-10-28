<script setup lang="ts">
const { paused } = useMotion()

const lines = [
    '$ whoami',
    'taha@portfolio:~$ building dependable software',
    'taha@portfolio:~$ cloud · platform · product'
]

const displayed = shallowRef('')
const activeLine = shallowRef(0)
const reduced = shallowRef(false)
let timer: ReturnType<typeof setTimeout> | undefined

function clearTimer() {
    if (timer) clearTimeout(timer)
    timer = undefined
}

function typeNext() {
    clearTimer()
    if (paused.value) return

    const target = lines[activeLine.value]
    if (displayed.value.length < target.length) {
        displayed.value += target[displayed.value.length]
        timer = setTimeout(typeNext, 26)
        return
    }

    timer = setTimeout(() => {
        activeLine.value = (activeLine.value + 1) % lines.length
        displayed.value = ''
        typeNext()
    }, 1750)
}

onMounted(() => {
    reduced.value = matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced.value) {
        displayed.value = lines[1]
        activeLine.value = 1
        return
    }
    typeNext()
})

watch(paused, (isPaused) => {
    if (isPaused || reduced.value) {
        clearTimer()
        return
    }
    typeNext()
})

onBeforeUnmount(clearTimer)
</script>

<template>
    <p class="terminal" aria-label="Terminal status">
        <span class="terminal__prompt" aria-hidden="true">›</span>
        <span>{{ displayed }}</span><span v-if="!reduced" class="terminal__cursor" aria-hidden="true">_</span>
    </p>
</template>

<style scoped>
.terminal {
    display: flex;
    align-items: baseline;
    gap: 0.5em;
    min-height: 1.6em;
    margin: var(--space-lg) 0 0;
    color: var(--color-ink-2);
    font: 500 var(--text-xs)/1.6 var(--font-outlier);
}

.terminal__prompt { color: var(--color-accent-2); }
.terminal__cursor { color: var(--color-accent-2); animation: terminal-blink 0.85s steps(2, end) infinite; }

@keyframes terminal-blink { 50% { opacity: 0; } }

@media (prefers-reduced-motion: reduce) {
    .terminal__cursor { animation: none; }
}
</style>

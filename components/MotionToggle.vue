<script setup lang="ts">
const { paused, setPaused, restore } = useMotion()
const { $motion } = useNuxtApp()

function syncMotion(value: boolean) {
    setPaused(value)
    $motion?.setPaused(value)
}

onMounted(() => {
    restore()
    $motion?.setPaused(paused.value)
})
</script>

<template>
    <button class="text-button" type="button" data-loop-toggle @click="syncMotion(!paused)">
        {{ paused ? 'Play motion' : 'Pause motion' }}
    </button>
</template>

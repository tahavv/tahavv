<script setup lang="ts">
const { paused, setPaused, restore } = useMotion()
onMounted(restore)
</script>

<template>
    <button class="text-button" type="button" data-loop-toggle @click="setPaused(!paused)">
        {{ paused ? 'Play motion' : 'Pause motion' }}
    </button>
</template>

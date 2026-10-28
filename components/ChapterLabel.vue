<script setup lang="ts">
defineProps<{ no: string, name: string }>()
</script>

<template>
    <p class="chapter-label"><span class="chapter-label__no">{{ no }}</span>{{ name }}</p>
</template>

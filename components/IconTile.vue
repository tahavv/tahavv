<script setup lang="ts">
import { iconPath } from '~/content/icons'

const props = defineProps<{ name: string, size?: 'sm' | 'md' | 'lg' }>()
const path = computed(() => iconPath(props.name))
</script>

<template>
    <span class="icon-tile" :class="`icon-tile--${size || 'md'}`" :title="name">
        <svg v-if="path" viewBox="0 0 24 24" aria-hidden="true"><path :d="path" /></svg>
        <span class="visually-hidden">{{ name }}</span>
    </span>
</template>

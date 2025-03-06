<template>
    <button @click="toggleColorMode"
        class="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-amber-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
        aria-label="Toggle dark mode">
        <Icon v-if="isDark" name="heroicons:sun" class="w-5 h-5" />
        <Icon v-else name="heroicons:moon" class="w-5 h-5" />
    </button>
</template>

<script setup>
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

function toggleColorMode() {
    colorMode.preference = isDark.value ? 'light' : 'dark'
}
</script>
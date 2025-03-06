<template>
    <div class="relative flex flex-col md:flex-row items-center" :class="{ 'appear-animation': true }">
        <!-- Timeline dot -->
        <div
            class="absolute left-0 md:left-1/2 w-6 h-6 rounded-full bg-gradient-to-r from-amber-500 to-blue-600 border-4 border-white dark:border-gray-800 transform md:-translate-x-1/2 z-10 animate-pulse">
        </div>

        <!-- Content wrapper -->
        <div class="w-full md:w-1/2 md:pr-12 transition-all duration-500 hover:md:pr-6"
            :class="{ 'md:pl-12 md:pr-0 md:order-2 hover:md:pl-6 hover:md:pr-0': !isLeft }">
            <div
                class="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                <div class="flex flex-wrap justify-between items-start mb-4">
                    <div>
                        <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ position }}</h3>
                        <h4 class="text-lg font-medium text-amber-600 dark:text-amber-400">{{ company }}</h4>
                    </div>
                    <span
                        class="text-sm font-medium bg-gradient-to-r from-amber-100 to-blue-100 dark:from-amber-900/30 dark:to-blue-900/30 text-gray-700 dark:text-gray-300 py-1 px-3 rounded-full">
                        {{ duration }}
                    </span>
                </div>

                <div class="mb-4">
                    <h5 class="font-semibold mb-2 text-gray-800 dark:text-gray-200">Responsibilities:</h5>
                    <ul class="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                        <li v-for="(item, index) in responsibilities" :key="index"
                            class="transition-all duration-300 hover:text-amber-700 dark:hover:text-amber-300 hover:translate-x-1">
                            {{ item }}
                        </li>
                    </ul>
                </div>

                <div v-if="achievements && achievements.length" class="mb-4">
                    <h5 class="font-semibold mb-2 text-gray-800 dark:text-gray-200">Achievements:</h5>
                    <ul class="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                        <li v-for="(item, index) in achievements" :key="index"
                            class="transition-all duration-300 hover:text-blue-700 dark:hover:text-blue-300 hover:translate-x-1">
                            {{ item }}
                        </li>
                    </ul>
                </div>

                <div class="flex flex-wrap gap-2">
                    <span v-for="tech in technologies" :key="tech"
                        class="text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 py-1 px-2 rounded transition-all duration-300 hover:bg-amber-100 dark:hover:bg-amber-900/30 hover:text-amber-800 dark:hover:text-amber-300">
                        {{ tech }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    position: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    responsibilities: {
        type: Array,
        required: true
    },
    achievements: {
        type: Array,
        default: () => []
    },
    technologies: {
        type: Array,
        default: () => []
    },
    isLeft: {
        type: Boolean,
        default: false
    }
})
</script>

<style scoped>
.appear-animation {
    opacity: 0;
    transform: translateY(20px);
    animation: appear 0.5s ease-out forwards;
}

@keyframes appear {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
<template>
    <div
        class="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md transition-all duration-500 hover:shadow-xl hover:-translate-y-2 group">
        <div class="aspect-w-16 aspect-h-9 relative">
            <img :src="project.image || '/images/project.png'" :alt="project.title"
                class="w-full h-48 object-cover transition-all duration-500 group-hover:scale-105" />
            <div
                class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end">
                <div
                    class="p-4 flex justify-center space-x-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <a v-if="project.github" :href="project.github" target="_blank" rel="noopener noreferrer"
                        class="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/40 transition-all duration-300 hover:scale-110">
                        <Icon name="mdi:github" class="w-5 h-5" />
                    </a>
                    <a v-if="project.liveDemo" :href="project.liveDemo" target="_blank" rel="noopener noreferrer"
                        class="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/40 transition-all duration-300 hover:scale-110">
                        <Icon name="heroicons:globe-alt" class="w-5 h-5" />
                    </a>
                    <NuxtLink :to="`/projects/${project.id}`"
                        class="bg-gradient-to-r from-amber-500 to-blue-600 text-white px-4 py-1 rounded-full hover:from-amber-600 hover:to-blue-700 transition-all duration-300 text-sm font-medium hover:scale-105">
                        View Details
                    </NuxtLink>
                </div>
            </div>
        </div>

        <div class="p-6">
            <h3
                class="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300">
                {{ project.title }}
            </h3>
            <p class="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{{ project.description }}</p>

            <div class="flex flex-wrap gap-2 mb-4">
                <span v-for="tech in project.technologies.slice(0, 3)" :key="tech"
                    class="text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 py-1 px-2 rounded transition-all duration-300 hover:bg-amber-100 dark:hover:bg-amber-900/30 hover:text-amber-800 dark:hover:text-amber-300">
                    {{ tech }}
                </span>
                <span v-if="project.technologies.length > 3"
                    class="text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 py-1 px-2 rounded">
                    +{{ project.technologies.length - 3 }} more
                </span>
            </div>

            <NuxtLink :to="`/projects/${project.id}`"
                class="text-blue-600 dark:text-blue-400 font-medium inline-flex items-center group">
                View Project
                <Icon name="heroicons:arrow-right"
                    class="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
            </NuxtLink>
        </div>
    </div>
</template>

<script setup>
defineProps({
    project: {
        type: Object,
        required: true
    }
})
</script>
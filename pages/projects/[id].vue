<template>
    <div class="py-16 bg-white dark:bg-gray-900">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
            <div v-if="project" class="max-w-4xl mx-auto">
                <NuxtLink to="/#projects" class="inline-flex items-center mb-8 text-blue-600 dark:text-blue-400 font-medium group">
                    <Icon name="heroicons:arrow-left"
                        class="mr-1 w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                    Back to Projects
                </NuxtLink>

                <div class="rounded-xl overflow-hidden mb-8">
                    <img :src="project.image || '/images/project.png'" :alt="project.title" class="w-full h-auto max-h-96 object-cover" />
                </div>

                <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">{{ project.title }}</h1>
                <p class="text-blue-700 dark:text-blue-300 font-medium mb-4">{{ project.tagline }}</p>
                <p class="text-lg text-gray-700 dark:text-gray-300 mb-8">{{ project.description }}</p>

                <div class="grid md:grid-cols-3 gap-4 mb-10">
                    <article class="rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
                        <h2 class="font-semibold text-gray-900 dark:text-white mb-2">Challenge</h2>
                        <p class="text-sm text-gray-700 dark:text-gray-300">{{ project.challenge }}</p>
                    </article>
                    <article class="rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
                        <h2 class="font-semibold text-gray-900 dark:text-white mb-2">Approach</h2>
                        <p class="text-sm text-gray-700 dark:text-gray-300">{{ project.approach }}</p>
                    </article>
                    <article class="rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
                        <h2 class="font-semibold text-gray-900 dark:text-white mb-2">Outcome</h2>
                        <p class="text-sm text-gray-700 dark:text-gray-300">{{ project.outcome }}</p>
                    </article>
                </div>

                <div class="mb-8">
                    <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Technologies</h2>
                    <div class="flex flex-wrap gap-2">
                        <span v-for="tech in project.technologies" :key="tech"
                            class="text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 py-1 px-3 rounded-full">
                            {{ tech }}
                        </span>
                    </div>
                </div>

                <a v-if="project.github" :href="project.github" target="_blank" rel="noopener noreferrer" class="btn-secondary inline-flex">
                    <Icon name="mdi:github" class="mr-2 w-5 h-5" />
                    View Source
                </a>
            </div>

            <div v-else class="max-w-4xl mx-auto text-center py-16">
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Project Not Found</h1>
                <p class="text-gray-600 dark:text-gray-400 mb-8">The project you're looking for doesn't exist or has been removed.</p>
                <NuxtLink to="/#projects" class="btn-primary">
                    Return to Projects
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup>
import { featuredProjects } from '~/content/profile'

const route = useRoute()
const projectId = route.params.id

const project = computed(() => featuredProjects.find((item) => item.id === projectId))

useHead(() => ({
    title: project.value ? `${project.value.title} | Taha Ayari` : 'Project Not Found | Taha Ayari',
    meta: [
        {
            name: 'description',
            content: project.value
                ? `${project.value.title} case study focused on cloud and platform engineering delivery.`
                : 'Project not found'
        }
    ]
}))
</script>

<template>
    <section :id="id" class="section bg-white dark:bg-gray-900">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="section-title text-gray-900 dark:text-white">Featured Projects</h2>
            <p class="text-center text-gray-600 dark:text-gray-300 max-w-3xl mx-auto -mt-8 mb-10">
                Case-study style highlights from telecom and travel platforms with emphasis on delivery workflows,
                observability, and production readiness.
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <ProjectCard v-for="project in featuredProjects" :key="project.id" :project="project" />
            </div>
        </div>
    </section>
</template>

<script setup>
import { featuredProjects } from '~/content/profile'

defineProps({
    id: {
        type: String,
        default: 'projects'
    }
})
</script>

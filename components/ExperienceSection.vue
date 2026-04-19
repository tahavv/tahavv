<template>
    <section :id="id" class="section bg-gray-50 dark:bg-gray-800">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="section-title text-gray-900 dark:text-white">Experience</h2>
            <p class="text-center text-gray-600 dark:text-gray-300 max-w-3xl mx-auto -mt-8 mb-10">
                Reverse-chronological timeline of software engineering work focused on cloud-ready systems, platform
                reliability, and production web applications.
            </p>

            <div class="relative mt-12">
                <div class="absolute left-0 md:left-1/2 top-0 h-full w-1 bg-blue-600 transform md:translate-x-0.5"></div>
                <div class="space-y-12">
                    <ExperienceTimelineItem v-for="(item, index) in experience" :key="`${item.company}-${item.period}`"
                        :position="item.role" :company="item.company" :duration="item.period" :responsibilities="item.summary"
                        :technologies="item.technologies" :is-left="index % 2 === 0" />
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { experience } from '~/content/profile'

defineProps({
    id: {
        type: String,
        default: 'experience'
    }
})
</script>

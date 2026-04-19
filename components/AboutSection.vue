<template>
    <section :id="id" class="section bg-white dark:bg-gray-900 relative overflow-hidden">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div class="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
                <div class="w-full lg:w-1/3 flex justify-center animate-fade-in">
                    <div class="relative w-64 h-64 rounded-full overflow-hidden border-4 border-blue-600 shadow-lg">
                        <img :src="profileImage" alt="Taha Ayari" class="w-full h-full object-cover" />
                    </div>
                </div>

                <div class="w-full lg:w-2/3 animate-slide-in">
                    <p class="text-sm uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-2">Software Engineer</p>
                    <h1 class="text-4xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                        {{ profile.name }}
                    </h1>
                    <h2 class="text-2xl sm:text-3xl font-medium mb-6 text-blue-600 dark:text-blue-400">
                        {{ profile.title }}
                    </h2>
                    <p class="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                        I build reliable software systems across application, cloud, and platform layers. My work focuses on
                        production-ready web platforms, CI/CD automation, observability, and scalable service delivery for
                        telecom and travel domains.
                    </p>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <div class="rounded-lg bg-gray-50 dark:bg-gray-800 p-4">
                            <p class="text-sm text-gray-500 dark:text-gray-400">Primary Focus</p>
                            <p class="font-semibold text-gray-900 dark:text-white">Cloud, Platform Engineering, Full-Stack Delivery</p>
                        </div>
                        <div class="rounded-lg bg-gray-50 dark:bg-gray-800 p-4">
                            <p class="text-sm text-gray-500 dark:text-gray-400">Core Stack</p>
                            <p class="font-semibold text-gray-900 dark:text-white">Angular, Spring Boot, Docker, Kubernetes, Jenkins</p>
                        </div>
                    </div>

                    <div class="flex gap-4 mb-8 animate-fade-in">
                        <a :href="profile.github" target="_blank" rel="noopener noreferrer"
                            class="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300">
                            <Icon name="mdi:github" class="w-6 h-6 text-gray-700 dark:text-gray-300" />
                        </a>
                        <a :href="profile.linkedin" target="_blank" rel="noopener noreferrer"
                            class="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300">
                            <Icon name="mdi:linkedin" class="w-6 h-6 text-blue-600" />
                        </a>
                    </div>

                    <div class="flex flex-wrap gap-4 animate-slide-in">
                        <NuxtLink to="#contact" class="btn-primary">
                            Contact Me
                        </NuxtLink>
                        <a href="/taha_ayari_cv_en.pdf" target="_blank" class="btn-secondary">
                            Download CV
                            <Icon name="heroicons:arrow-down-tray" class="ml-2 w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <div class="waves absolute bottom-0 left-0 w-full pointer-events-none"></div>
    </section>
</template>

<script setup>
import { profile } from '~/content/profile'
import profileImage from '~/assets/images/profile.jpg'

defineProps({
    id: {
        type: String,
        default: 'about'
    }
})
</script>

<template>
    <section :id="id" class="min-h-screen w-full flex flex-col justify-center items-center relative overflow-hidden px-4 md:px-8 pt-20 pb-32">
        
        <!-- Spotlight Background Effect -->
        <div class="absolute inset-0 bg-spotlight pointer-events-none"></div>

        <div class="max-w-4xl mx-auto w-full text-center relative z-10 animate-fade-in-up">
            
            <div class="mb-8 inline-flex items-center space-x-2 border border-surface-200 bg-surface-50 px-3 py-1 rounded-full text-xs font-mono text-text-secondary shadow-sm">
                <span class="relative flex h-2 w-2">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Systems online. Ready for deployment.</span>
            </div>

            <h1 class="text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter text-white mb-6 leading-none selection:bg-white selection:text-black">
                {{ profile.name }}. <br/>
                <span class="text-surface-300">{{ profile.title.split('|')[0].trim() }}.</span>
            </h1>

            <p class="text-xl md:text-2xl text-text-muted max-w-2xl mx-auto font-medium tracking-tight mb-12">
                I build robust platform infrastructure and cloud-native applications that scale.
            </p>

            <div class="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4">
                <NuxtLink to="#projects" class="w-full sm:w-auto btn-primary">
                    View Work
                </NuxtLink>
                <NuxtLink to="#contact" class="w-full sm:w-auto btn-secondary">
                    Contact Me
                </NuxtLink>
                <a href="/taha_ayari_cv_en.pdf" target="_blank" class="w-full sm:w-auto btn-secondary">
                    Download CV
                    <Icon name="heroicons:arrow-down-tray" class="ml-2 w-4 h-4" />
                </a>
            </div>

            <div class="flex gap-4 mt-8 justify-center animate-fade-in">
                <a :href="profile.github" target="_blank" rel="noopener noreferrer"
                    class="w-10 h-10 rounded-full border border-surface-200 bg-surface-50 flex items-center justify-center hover:bg-surface-100 transition-colors duration-300">
                    <Icon name="mdi:github" class="w-5 h-5 text-text-secondary" />
                </a>
                <a :href="profile.linkedin" target="_blank" rel="noopener noreferrer"
                    class="w-10 h-10 rounded-full border border-surface-200 bg-surface-50 flex items-center justify-center hover:bg-surface-100 transition-colors duration-300">
                    <Icon name="mdi:linkedin" class="w-5 h-5 text-text-secondary" />
                </a>
            </div>

            <div class="mt-16 pt-8 border-t border-border flex flex-wrap justify-center items-center gap-8 text-sm text-text-muted font-mono animate-fade-in" style="animation-delay: 500ms;">
                <div v-for="item in coreStackIcons" :key="item.label" class="flex items-center gap-2">
                    <Icon :name="item.icon" class="w-5 h-5" /> {{ item.label }}
                </div>
            </div>

        </div>
    </section>
</template>

<script setup>
import { profile } from '~/content/profile'

const coreStackIcons = [
    { label: 'Angular', icon: 'mdi:angular' },
    { label: 'Spring Boot', icon: 'simple-icons:springboot' },
    { label: 'Docker', icon: 'mdi:docker' },
    { label: 'Kubernetes', icon: 'mdi:kubernetes' },
    { label: 'Jenkins', icon: 'simple-icons:jenkins' }
]

defineProps({
    id: {
        type: String,
        default: 'about'
    }
})
</script>

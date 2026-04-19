<template>
    <section :id="id" class="min-h-screen w-full flex flex-col justify-center items-center relative overflow-hidden px-4 md:px-8 py-24 md:py-32">
        
        <div class="max-w-6xl mx-auto w-full relative z-10 flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-8">
            
            <!-- Text Content -->
            <div class="w-full lg:w-3/5 text-center lg:text-left animate-fade-in-up">
                <div class="mb-8 inline-flex items-center space-x-2 border border-white/10 bg-white/5 px-4 py-1.5 rounded-full text-xs font-mono text-text-secondary shadow-lg backdrop-blur-md">
                    <span class="relative flex h-2 w-2">
                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-400 opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-2 w-2 bg-secondary-500"></span>
                    </span>
                    <span>Open for new opportunities</span>
                </div>

                <h1 class="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter text-white mb-6 leading-[1.1]">
                    {{ profile.name }}. <br/>
                    <span class="bg-gradient-to-br from-primary-400 to-secondary-400 text-transparent bg-clip-text">{{ profile.title.split('|')[0].trim() }}.</span>
                </h1>

                <p class="text-xl md:text-2xl text-text-muted max-w-2xl mx-auto lg:mx-0 font-medium tracking-tight mb-10">
                    I build robust platform infrastructure and cloud-native applications that scale.
                </p>

                <div class="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-4 mb-10">
                    <NuxtLink to="#projects" class="w-full sm:w-auto btn-primary">
                        View Work
                    </NuxtLink>
                    <a href="/taha_ayari_cv_en.pdf" target="_blank" class="w-full sm:w-auto btn-secondary">
                        Download CV
                        <Icon name="heroicons:arrow-down-tray" class="ml-2 w-4 h-4" />
                    </a>
                </div>

                <div class="flex gap-4 justify-center lg:justify-start animate-fade-in flex-wrap">
                    <a :href="profile.github" target="_blank" rel="noopener noreferrer"
                        class="w-12 h-12 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 shadow-lg">
                        <Icon name="mdi:github" class="w-6 h-6 text-white" />
                    </a>
                    <a :href="profile.linkedin" target="_blank" rel="noopener noreferrer"
                        class="w-12 h-12 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 shadow-lg">
                        <Icon name="mdi:linkedin" class="w-6 h-6 text-[#0A66C2]" />
                    </a>
                    <a v-if="profile.whatsapp" :href="profile.whatsapp" target="_blank" rel="noopener noreferrer"
                        class="w-12 h-12 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 shadow-lg">
                        <Icon name="mdi:whatsapp" class="w-6 h-6 text-[#25D366]" />
                    </a>
                    <a v-if="profile.portfolio" :href="profile.portfolio" target="_blank" rel="noopener noreferrer"
                        class="w-12 h-12 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 shadow-lg">
                        <Icon name="mdi:web" class="w-6 h-6 text-secondary-400" />
                    </a>
                </div>

                <div class="mt-12 pt-8 border-t border-white/10 flex flex-wrap justify-center lg:justify-start items-center gap-6 text-sm text-text-muted font-mono animate-fade-in" style="animation-delay: 500ms;">
                    <div v-for="item in coreStackIcons" :key="item.label" class="flex items-center gap-2">
                        <Icon :name="item.icon" class="w-5 h-5 opacity-70" /> {{ item.label }}
                    </div>
                </div>
            </div>

            <!-- Image Content -->
            <div class="w-full lg:w-2/5 flex justify-center animate-fade-in">
                <div class="relative group">
                    <div class="w-56 h-56 sm:w-64 sm:h-64 lg:w-80 lg:h-80 rounded-full overflow-hidden border-4 border-white/10 shadow-[0_0_50px_rgba(99,102,241,0.25)] relative z-10 group-hover:scale-105 group-hover:border-primary-500/50 transition-all duration-500 bg-background/50 backdrop-blur-sm">
                        <img src="/images/taha.jpeg" alt="Taha Ayari" class="w-full h-full object-cover object-top" />
                    </div>
                    <!-- Glowing orb behind the image -->
                    <div class="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full blur-[50px] opacity-40 group-hover:opacity-70 group-hover:animate-pulse z-0 transition-opacity duration-500 scale-110"></div>
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
    { label: 'Jenkins', icon: 'simple-icons:jenkins' },
    { label: 'GCP', icon: 'mdi:google-cloud' }
]

defineProps({
    id: {
        type: String,
        default: 'about'
    }
})
</script>

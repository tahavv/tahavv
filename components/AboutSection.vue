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
                Taha Ayari. <br/>
                <span class="text-surface-300">Software Engineer.</span>
            </h1>

            <p class="text-xl md:text-2xl text-text-muted max-w-2xl mx-auto font-medium tracking-tight mb-12">
                I build robust platform infrastructure and cloud-native applications that scale.
            </p>

            <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
                <NuxtLink to="#projects" class="w-full sm:w-auto btn-primary">
                    View Work
                </NuxtLink>
                <NuxtLink to="#contact" class="w-full sm:w-auto btn-secondary">
                    Contact Me
                </NuxtLink>
            </div>

            <div class="mt-24 pt-8 border-t border-border flex flex-col sm:flex-row justify-center items-center gap-8 text-sm text-text-muted font-mono animate-fade-in" style="animation-delay: 500ms;">
                <div class="flex items-center gap-2">
                    <Icon name="mdi:kubernetes" class="w-5 h-5" /> Kubernetes
                </div>
                <div class="flex items-center gap-2">
                    <Icon name="mdi:docker" class="w-5 h-5" /> Docker
                </div>
                <div class="flex items-center gap-2">
                    <Icon name="mdi:google-cloud" class="w-5 h-5" /> GCP
                </div>
                <div class="flex items-center gap-2">
                    <Icon name="mdi:vuejs" class="w-5 h-5" /> Nuxt
                </div>
                <div class="flex items-center gap-2">
                    <Icon name="bx:bxl-spring-boot" class="w-5 h-5" /> Spring
                </div>
            </div>

        </div>
    </section>
</template>

<script setup>
defineProps({
    id: {
        type: String,
        default: 'about'
    }
})
</script>

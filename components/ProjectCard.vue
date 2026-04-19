<template>
    <div class="glass-panel group flex flex-col h-full cursor-pointer hover:shadow-[0_0_30px_rgba(99,102,241,0.2)] hover:-translate-y-2">
        <!-- Image Wrapper -->
        <div class="relative w-full aspect-[16/9] overflow-hidden bg-white/5">
            <template v-if="project.image">
                 <NuxtImg 
                    :src="project.image" 
                    :alt="project.title" 
                    class="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 mix-blend-overlay group-hover:mix-blend-normal"
                    loading="lazy"
                 />
            </template>
            <div v-else class="w-full h-full flex items-center justify-center font-mono text-text-muted text-sm mix-blend-overlay">
                [no_image_data]
            </div>
            
            <!-- Colorful Gradient Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/80 to-transparent opacity-100 group-hover:opacity-50 transition-opacity duration-500"></div>
        </div>

        <!-- Content -->
        <div class="p-6 flex flex-col grow relative z-10">
            <div class="flex justify-between items-start mb-4">
                <h3 class="text-xl font-bold text-white tracking-tight group-hover:text-primary-400 transition-colors duration-300">{{ project.title }}</h3>
                <div class="flex gap-3">
                    <a v-if="project.demo" :href="project.demo" target="_blank" rel="noopener noreferrer" 
                       class="text-text-muted hover:text-secondary-400 transition-colors" aria-label="Demo">
                       <Icon name="mdi:open-in-new" class="w-5 h-5" />
                    </a>
                    <a v-if="project.github" :href="project.github" target="_blank" rel="noopener noreferrer" 
                       class="text-text-muted hover:text-primary-400 transition-colors" aria-label="GitHub">
                       <Icon name="mdi:github" class="w-5 h-5" />
                    </a>
                </div>
            </div>
            
            <p class="text-sm text-text-secondary leading-relaxed mb-6 font-medium">
                {{ project.description }}
            </p>

            <div class="mt-auto flex gap-2 flex-wrap pt-4 border-t border-white/10">
                <span v-for="tech in project.technologies.slice(0, 4)" :key="tech" 
                      class="text-xs font-mono text-primary-200/80 bg-primary-500/10 border border-primary-500/20 px-2 py-0.5 rounded-sm backdrop-blur-sm">
                    {{ tech }}
                </span>
                <span v-if="project.technologies.length > 4" class="text-xs font-mono text-text-muted px-2 py-0.5">
                    +{{ project.technologies.length - 4 }}
                </span>
            </div>
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

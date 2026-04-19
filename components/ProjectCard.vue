<template>
    <div class="glow-card group flex flex-col h-full bg-surface-50 cursor-pointer">
        <!-- Minimal Image Wrapper -->
        <div class="relative w-full aspect-[16/9] overflow-hidden bg-surface-100 border-b border-border">
            <template v-if="project.image">
                 <NuxtImg 
                    :src="project.image" 
                    :alt="project.title" 
                    class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 grayscale group-hover:grayscale-0"
                    loading="lazy"
                 />
            </template>
            <div v-else class="w-full h-full flex items-center justify-center font-mono text-text-muted text-sm border-b border-border">
                [no_image_data]
            </div>
            
            <div class="absolute inset-0 bg-gradient-to-t from-surface-50 via-transparent to-transparent opacity-100 mix-blend-multiply"></div>
        </div>

        <!-- Content -->
        <div class="p-6 flex flex-col grow">
            <div class="flex justify-between items-start mb-4">
                <h3 class="text-lg font-semibold text-white tracking-tight">{{ project.title }}</h3>
                <div class="flex gap-2">
                    <a v-if="project.demo" :href="project.demo" target="_blank" rel="noopener noreferrer" 
                       class="text-text-muted hover:text-white transition-colors" aria-label="Demo">
                       <Icon name="mdi:open-in-new" class="w-5 h-5" />
                    </a>
                    <a v-if="project.github" :href="project.github" target="_blank" rel="noopener noreferrer" 
                       class="text-text-muted hover:text-white transition-colors" aria-label="GitHub">
                       <Icon name="mdi:github" class="w-5 h-5" />
                    </a>
                </div>
            </div>
            
            <p class="text-sm text-text-secondary leading-relaxed mb-6 font-medium">
                {{ project.description }}
            </p>

            <div class="mt-auto flex gap-2 flex-wrap pt-4 border-t border-surface-100">
                <span v-for="tech in project.technologies.slice(0, 4)" :key="tech" 
                      class="text-xs font-mono text-text-muted bg-surface-100 px-2 py-0.5 rounded-sm">
                    {{ tech }}
                </span>
                <span v-if="project.technologies.length > 4" class="text-xs font-mono text-text-muted">
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

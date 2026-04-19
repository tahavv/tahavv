<template>
    <div class="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-8 hover:opacity-100 opacity-90 transition-opacity duration-300">
        
        <div class="md:w-1/4 shrink-0">
            <p class="text-sm font-mono text-text-secondary">{{ job.period }}</p>
        </div>

        <div class="md:w-3/4">
            <h3 class="text-xl font-bold text-white mb-1">{{ job.role }}</h3>
            <p class="text-lg font-medium text-text-secondary mb-4">{{ job.company }}</p>
            
            <ul class="space-y-3 mb-6">
                <li v-for="(item, i) in job.summary" :key="i" class="text-text-muted text-base leading-relaxed flex items-start">
                    <span class="mr-3 text-surface-200">-</span>
                    <span>{{ item }}</span>
                </li>
            </ul>

            <div class="flex flex-wrap gap-2">
                <span v-for="tech in job.technologies" :key="tech" 
                      class="px-2 py-1 bg-surface-50 text-text-secondary text-xs rounded border border-surface-200 font-mono tracking-tight cursor-default hover:bg-surface-100 hover:text-white transition-colors">
                    {{ tech }}
                </span>
            </div>
        </div>
        
    </div>
</template>

<script setup>
defineProps({
    job: {
        type: Object,
        required: true
    }
})
</script>
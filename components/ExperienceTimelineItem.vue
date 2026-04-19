<template>
    <div class="relative group">
        <!-- Timeline Dot -->
        <div class="absolute -left-[43px] md:-left-[59px] top-8 w-5 h-5 rounded-full bg-background border-2 border-primary-500 shadow-[0_0_15px_rgba(99,102,241,0.6)] group-hover:scale-125 group-hover:bg-primary-500 transition-all duration-300 z-10"></div>
        
        <!-- Glass Panel -->
        <div class="glass-panel p-6 md:p-8 flex flex-col hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(45,212,191,0.15)] group-hover:border-white/20 transition-all duration-500">
            <div class="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                <h3 class="text-xl font-bold text-white">{{ job.role }}</h3>
                <span class="text-sm font-mono text-secondary-400 font-medium px-3 py-1 bg-secondary-400/10 rounded-full border border-secondary-400/20 backdrop-blur-sm self-start md:self-auto">{{ job.period }}</span>
            </div>
            
            <p class="text-lg font-medium text-text-secondary mb-6">{{ job.company }}</p>
            
            <ul class="space-y-3 mb-8">
                <li v-for="(item, i) in job.summary" :key="i" class="text-text-secondary text-base leading-relaxed flex items-start">
                    <Icon name="mdi:chevron-right" class="mr-2 w-5 h-5 text-primary-400 shrink-0 mt-0.5 group-hover:text-secondary-400 transition-colors" />
                    <span>{{ item }}</span>
                </li>
            </ul>

            <div class="flex flex-wrap gap-2 mt-auto">
                <span v-for="tech in job.technologies" :key="tech" 
                      class="px-3 py-1 bg-white/5 text-white/90 text-xs rounded-full border border-white/10 shadow-sm backdrop-blur-sm cursor-default hover:bg-primary-500/20 hover:border-primary-500/30 transition-colors">
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
<template>
    <section :id="id" class="w-full relative px-4 md:px-8 py-32 border-t border-white/5">
        <div class="max-w-4xl mx-auto w-full relative z-10">
            <h2 class="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-16">
                <span class="bg-gradient-to-r from-primary-400 to-secondary-400 text-transparent bg-clip-text">Experience.</span>
            </h2>
            
            <div class="relative border-l-2 border-white/10 ml-4 md:ml-6 pl-8 md:pl-12 space-y-12">
                <ExperienceTimelineItem 
                    v-for="(job, index) in experience" 
                    :key="index" 
                    :job="job" 
                />
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

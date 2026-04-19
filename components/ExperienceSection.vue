<template>
    <section :id="id" class="w-full relative px-4 md:px-8 py-32 border-t border-border">
        <div class="max-w-4xl mx-auto w-full">
            <h2 class="text-4xl font-extrabold tracking-tight text-white mb-16">Experience.</h2>
            
            <div class="flex flex-col gap-12 sm:gap-16">
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

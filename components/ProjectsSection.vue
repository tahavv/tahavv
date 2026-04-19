<template>
    <section :id="id" class="w-full relative px-4 md:px-8 py-32 border-t border-border">
        <div class="max-w-6xl mx-auto w-full">
            <h2 class="text-4xl font-extrabold tracking-tight text-white mb-16">Projects.</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ProjectCard 
                    v-for="project in featuredProjects" 
                    :key="project.id" 
                    :project="project"
                />
            </div>
            
            <div class="mt-16 text-center">
               <a href="https://github.com/tahavv" target="_blank" rel="noopener noreferrer" class="btn-secondary group">
                   Explore GitHub
                   <Icon name="mdi:arrow-right" class="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
               </a>
            </div>
        </div>
    </section>
</template>

<script setup>
import { featuredProjects } from '~/content/profile'

defineProps({
    id: {
        type: String,
        default: 'projects'
    }
})
</script>

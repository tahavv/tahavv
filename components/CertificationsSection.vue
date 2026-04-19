<template>
    <section :id="id" class="w-full relative px-4 md:px-8 py-32 border-t border-border">
        <div class="max-w-4xl mx-auto w-full">
            <h2 class="text-4xl font-extrabold tracking-tight text-white mb-12">Certifications.</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div v-for="cert in certificationItems" :key="cert.label" 
                      class="flex flex-col p-6 rounded-lg border border-surface-200 bg-surface-50 hover:bg-surface-100 transition-colors duration-300">
                      
                      <div class="flex items-start gap-4">
                          <Icon :name="cert.icon" class="w-8 h-8 text-white opacity-80 shrink-0" />
                          <h3 class="text-base font-bold text-white">{{ cert.label }}</h3>
                      </div>
                      
                 </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { certifications } from '~/content/profile'

const iconMap = {
    'Red Hat Certified System Administrator (RHCSA)': 'simple-icons:redhat',
    'Cisco NDG Linux Essentials': 'simple-icons:cisco'
}

const certificationItems = certifications.map((label) => ({
    label,
    icon: iconMap[label] || 'heroicons:academic-cap'
}))

defineProps({
    id: {
        type: String,
        default: 'certifications'
    }
})
</script>

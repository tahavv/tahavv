<template>
    <section :id="id" class="section bg-gray-50 dark:bg-gray-800">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="section-title text-gray-900 dark:text-white">Certifications</h2>
            <div class="max-w-3xl mx-auto grid gap-4">
                <article v-for="cert in certificationItems" :key="cert.label"
                    class="bg-white dark:bg-gray-900 rounded-lg p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div class="flex items-center gap-3">
                        <Icon :name="cert.icon" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        <p class="text-gray-900 dark:text-gray-100 font-medium">{{ cert.label }}</p>
                    </div>
                </article>
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

<template>
    <section :id="id" class="w-full relative px-4 md:px-8 py-32 border-t border-white/5">
        <div class="max-w-4xl mx-auto w-full relative z-10">
            <h2 class="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-16">
                <span class="bg-gradient-to-r from-primary-400 to-secondary-400 text-transparent bg-clip-text">Certifications.</span>
            </h2>
            
            <div class="flex flex-wrap justify-center gap-8">
                <div v-for="(cert, index) in certifications" :key="index"
                     class="glass-panel p-6 flex flex-col items-center justify-center hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(45,212,191,0.15)] transition-all">
                     
                     <div 
                        data-iframe-width="150" 
                        data-iframe-height="270" 
                        :data-share-badge-id="cert.badgeId" 
                        data-share-badge-host="https://www.credly.com">
                     </div>
                     
                     <a v-if="cert.link" :href="cert.link" target="_blank" rel="noopener noreferrer" 
                        class="mt-4 text-sm font-medium text-text-muted hover:text-primary-400 transition-colors flex items-center gap-2">
                        Verify Credential <Icon name="mdi:arrow-right" class="w-4 h-4" />
                     </a>
                </div>
            </div>
            
        </div>
    </section>
</template>

<script setup>
import { onMounted, onUnmounted, nextTick } from 'vue'
import { certifications } from '~/content/profile'

onMounted(async () => {
    // Wait for DOM to be fully populated before injecting the embed script
    await nextTick()

    // Remove any stale instance to ensure a clean re-bind
    const existingScript = document.getElementById('credly-embed-script')
    if (existingScript) {
        existingScript.remove()
    }

    const script = document.createElement('script')
    script.id = 'credly-embed-script'
    script.src = '//cdn.credly.com/assets/utilities/embed.js'
    script.async = true
    script.type = 'text/javascript'
    document.body.appendChild(script)
})

onUnmounted(() => {
    const script = document.getElementById('credly-embed-script')
    if (script) {
        script.remove()
    }
})

defineProps({
    id: {
        type: String,
        default: 'certifications'
    }
})
</script>

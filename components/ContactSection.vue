<template>
    <section :id="id" class="w-full relative px-4 md:px-8 py-32 border-t border-white/5">
        <div class="max-w-2xl mx-auto w-full relative z-10">
            
            <div class="text-center mb-16">
                <h2 class="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6">
                    Let's <span class="bg-gradient-to-r from-secondary-400 to-primary-400 text-transparent bg-clip-text">Connect.</span>
                </h2>
                <p class="text-lg text-text-secondary max-w-lg mx-auto">
                    I'm currently looking for new opportunities. Whether you have a question or just want to say hi, my inbox is always open.
                </p>
            </div>
            
            <div class="glass-panel p-6 md:p-10 relative overflow-hidden">
                 <!-- Background glow inside panel -->
                 <div class="absolute -top-24 -right-24 w-48 h-48 bg-primary-500/20 rounded-full blur-[64px] pointer-events-none"></div>

                <form @submit.prevent="submitForm" class="space-y-6 relative z-10">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div class="space-y-2">
                            <label for="name" class="block text-sm font-medium text-text-secondary">Name</label>
                            <input type="text" id="name" v-model="form.name" required
                                class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-text-muted focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all outline-none"
                                placeholder="John Doe" />
                        </div>
                        <div class="space-y-2">
                            <label for="email" class="block text-sm font-medium text-text-secondary">Email</label>
                            <input type="email" id="email" v-model="form.email" required
                                class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-text-muted focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all outline-none"
                                placeholder="john@example.com" />
                        </div>
                    </div>
                    
                    <div class="space-y-2">
                        <label for="message" class="block text-sm font-medium text-text-secondary">Message</label>
                        <textarea id="message" v-model="form.message" required rows="5"
                            class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-text-muted focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all outline-none resize-none"
                            placeholder="How can we help you?"></textarea>
                    </div>
                    
                    <button type="submit" 
                        class="w-full btn-primary py-4 text-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed" 
                        :disabled="status.submitting">
                        <span v-if="status.submitting">Sending Broadcast...</span>
                        <span v-else>Send Message</span>
                    </button>
                    
                    <div v-if="status.message" :class="[status.success ? 'text-secondary-400 bg-secondary-400/10 border-secondary-400/20' : 'text-red-400 bg-red-400/10 border-red-400/20']"
                        class="p-4 rounded-lg border text-sm text-center font-medium transition-all">
                        {{ status.message }}
                    </div>
                </form>
            </div>
            
        </div>
    </section>
</template>

<script setup>
import { ref, reactive } from 'vue'

defineProps({
    id: {
        type: String,
        default: 'contact'
    }
})

const form = reactive({
    name: '',
    email: '',
    message: ''
})

const status = reactive({
    submitting: false,
    success: false,
    message: ''
})

const submitForm = async () => {
    status.submitting = true
    status.message = ''
    
    try {
        const response = await $fetch('/api/contact', {
            method: 'POST',
            body: form
        })
        
        status.success = true
        status.message = "Message received. I'll get back to you shortly."
        form.name = ''
        form.email = ''
        form.message = ''
    } catch (error) {
        status.success = false
        status.message = error.data?.message || 'Transaction failed. Please try again later.'
    } finally {
        status.submitting = false
    }
}
</script>

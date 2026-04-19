<template>
    <section :id="id" class="w-full relative px-4 md:px-8 py-32 border-t border-border">
        <div class="max-w-2xl mx-auto w-full">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-extrabold tracking-tight text-white mb-4">Get in touch.</h2>
                <p class="text-lg text-text-secondary font-medium">Looking for a full-stack engineer? Let's talk.</p>
            </div>

            <form @submit.prevent="submitForm" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                        <label for="name" class="block text-sm font-medium text-text-secondary">Name</label>
                        <input type="text" id="name" v-model="form.name" required
                            class="w-full bg-surface-50 border border-surface-200 rounded-md px-4 py-3 text-white placeholder-text-muted focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-300"
                            placeholder="John Doe" :disabled="isSubmitting" />
                    </div>
                    <div class="space-y-2">
                        <label for="email" class="block text-sm font-medium text-text-secondary">Email</label>
                        <input type="email" id="email" v-model="form.email" required
                            class="w-full bg-surface-50 border border-surface-200 rounded-md px-4 py-3 text-white placeholder-text-muted focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-300"
                            placeholder="john@example.com" :disabled="isSubmitting" />
                    </div>
                </div>

                <div class="space-y-2">
                    <label for="message" class="block text-sm font-medium text-text-secondary">Message</label>
                    <textarea id="message" v-model="form.message" rows="5" required
                        class="w-full bg-surface-50 border border-surface-200 rounded-md px-4 py-3 text-white placeholder-text-muted focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-300 resize-none"
                        placeholder="How can we work together?" :disabled="isSubmitting"></textarea>
                </div>

                <!-- Toast Notifications within form area for minimal footprint -->
                <div v-if="submitStatus === 'success'" class="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-md text-sm font-medium text-center">
                    Message received. I will get back to you shortly.
                </div>
                <div v-if="submitStatus === 'error'" class="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-md text-sm font-medium text-center">
                    Failed to send message. Please try again.
                </div>

                <button type="submit" class="w-full btn-primary" :disabled="isSubmitting">
                    {{ isSubmitting ? 'Sending...' : 'Send Message' }}
                </button>
            </form>
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

const isSubmitting = ref(false)
const submitStatus = ref(null)

const submitForm = async () => {
    isSubmitting.value = true
    submitStatus.value = null

    try {
        const response = await $fetch('/api/contact', {
            method: 'POST',
            body: form
        })
        submitStatus.value = 'success'
        form.name = ''
        form.email = ''
        form.message = ''
        setTimeout(() => submitStatus.value = null, 5000)
    } catch (error) {
        submitStatus.value = 'error'
    } finally {
         isSubmitting.value = false
    }
}
</script>

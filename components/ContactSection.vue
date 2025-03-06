<template>
    <section :id="id" class="section bg-gray-50 dark:bg-gray-800">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="section-title text-gray-900 dark:text-white">
                <span class="text-amber-600 dark:text-amber-400">Get</span> In Touch
            </h2>

            <div class="max-w-3xl mx-auto">
                <div
                    class="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
                    <div class="p-6 sm:p-8">
                        <p class="text-gray-700 dark:text-gray-300 mb-8 text-center">
                            Have a project in mind or want to discuss collaboration opportunities?
                            Fill out the form below, and I'll get back to you as soon as possible.
                        </p>

                        <form @submit.prevent="submitForm" class="space-y-6">
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div class="group">
                                    <label for="name"
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                                    <input id="name" v-model="form.name" type="text" required
                                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-300"
                                        placeholder="Your name" />
                                </div>
                                <div class="group">
                                    <label for="email"
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                    <input id="email" v-model="form.email" type="email" required
                                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-300"
                                        placeholder="your.email@example.com" />
                                </div>
                            </div>

                            <div class="group">
                                <label for="subject"
                                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                                <input id="subject" v-model="form.subject" type="text" required
                                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-300"
                                    placeholder="Subject of your message" />
                            </div>

                            <div class="group">
                                <label for="message"
                                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                                <textarea id="message" v-model="form.message" rows="5" required
                                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-300"
                                    placeholder="Your message..."></textarea>
                            </div>

                            <div class="flex justify-center">
                                <button type="submit"
                                    class="px-6 py-3 bg-gradient-to-r from-amber-500 to-blue-600 text-white font-medium rounded-md hover:from-amber-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md"
                                    :disabled="isSubmitting">
                                    <span v-if="isSubmitting" class="flex items-center">
                                        <Icon name="heroicons:arrow-path" class="w-5 h-5 animate-spin mr-2" />
                                        Sending...
                                    </span>
                                    <span v-else class="flex items-center">
                                        <Icon name="heroicons:paper-airplane"
                                            class="w-5 h-5 mr-2 transform -rotate-45" />
                                        Send Message
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Toast Notifications -->
        <!-- Success Toast -->
        <transition name="fade-scale">
            <div v-if="showSuccess" class="toaster bg-green-500 text-white">
                <Icon name="heroicons:check-circle" class="w-5 h-5 mr-2 inline" />
                Message sent successfully!
            </div>
        </transition>

        <!-- Error Toast -->
        <transition name="fade-scale">
            <div v-if="showError" class="toaster bg-red-500 text-white">
                <Icon name="heroicons:x-circle" class="w-5 h-5 mr-2 inline" />
                Error sending message. Please try again.
            </div>
        </transition>

    </section>
</template>

<script setup>
import { ref } from 'vue'
import { useFetch } from '#app'

defineProps({
    id: {
        type: String,
        default: 'contact'
    }
})

const form = ref({
    name: '',
    email: '',
    subject: '',
    message: ''
})

const isSubmitting = ref(false)
const showSuccess = ref(false)
const showError = ref(false)

async function submitForm() {
    isSubmitting.value = true
    showSuccess.value = false
    showError.value = false

    try {
        const { data, error } = await useFetch('/api/contact', {
            method: 'POST',
            body: form.value
        })

        if (data.value?.success) {
            showSuccess.value = true
            form.value = { name: '', email: '', subject: '', message: '' }
        } else {
            showError.value = true
        }
    } catch (error) {
        showError.value = true
    } finally {
        isSubmitting.value = false

        setTimeout(() => {
            showSuccess.value = false
            showError.value = false
        }, 5000)
    }
}
</script>

<style scoped>
/* Fade animation */
.fade-scale-enter-active,
.fade-scale-leave-active {
    transition: all 0.5s ease;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
    opacity: 0;
    transform: scale(0.95);
}

/* Toaster always on top */
.toaster {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    /* Ensure it's above everything */
    padding: 10px 15px;
    border-radius: 8px;
    font-weight: bold;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}
</style>

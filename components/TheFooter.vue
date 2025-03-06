<template>
    <footer class="bg-gray-900 text-white py-12">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col md:flex-row justify-between items-center">
                <div class="mb-6 md:mb-0">
                    <h2 class="text-2xl font-bold mb-2">Taha Ayari</h2>
                    <p class="text-gray-400 max-w-md">
                        Full Stack Developer specializing in Java, Angular, and Python. Building scalable, real-time
                        solutions with microservices and cloud technologies.
                    </p>
                </div>

                <div class="flex flex-col items-center md:items-end">
                    <div class="flex space-x-4 mb-4">
                        <a href="https://github.com/tahavv" target="_blank" rel="noopener noreferrer"
                            class="text-gray-400 hover:text-white transition-colors duration-300">
                            <Icon name="mdi:github" class="w-6 h-6" />
                        </a>
                        <a href="https://www.linkedin.com/in/taha-ayari-090a0b199/" target="_blank"
                            rel="noopener noreferrer"
                            class="text-gray-400 hover:text-white transition-colors duration-300">
                            <Icon name="mdi:linkedin" class="w-6 h-6" />
                        </a>
                        <a href="mailto:taha.ayari@iteam-univ.tn"
                            class="text-gray-400 hover:text-white transition-colors duration-300">
                            <Icon name="heroicons:envelope" class="w-6 h-6" />
                        </a>
                    </div>
                    <p class="text-gray-500 text-sm">&copy; {{ currentYear }} Taha Ayari. All rights reserved.</p>
                </div>
            </div>

            <div class="mt-8 pt-8 border-t border-gray-800 text-center">
                <nav class="flex flex-wrap justify-center gap-x-8 gap-y-4">
                    <NuxtLink v-for="item in navigationItems" :key="item.name" :to="item.href"
                        class="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                        {{ item.name }}
                    </NuxtLink>
                </nav>
            </div>
        </div>
    </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear()

const navigationItems = [
    { name: 'About', href: '/#about' },
    { name: 'Experience', href: '/#experience' },
    { name: 'Projects', href: '/#projects' },
    { name: 'Contact', href: '/#contact' }
]
</script>
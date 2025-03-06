<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <header class="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-sm z-50 transition-all duration-300">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <!-- Logo/Name -->
                    <div class="flex-shrink-0">
                        <NuxtLink to="/"
                            class="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                            <span class="text-amber-600 dark:text-amber-400">T</span>aha Ayari
                        </NuxtLink>
                    </div>

                    <!-- Desktop Navigation -->
                    <nav class="hidden md:flex items-center space-x-8">
                        <NuxtLink v-for="item in navigationItems" :key="item.name" :to="item.href"
                            class="text-gray-600 hover:text-amber-600 dark:text-gray-300 dark:hover:text-amber-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                            {{ item.name }}
                        </NuxtLink>
                        <DarkModeToggle />
                    </nav>

                    <!-- Mobile menu button and dark mode toggle -->
                    <div class="md:hidden flex items-center space-x-3">
                        <DarkModeToggle />
                        <button @click="isMobileMenuOpen = !isMobileMenuOpen"
                            class="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white focus:outline-none">
                            <span class="sr-only">Open main menu</span>
                            <Icon v-if="!isMobileMenuOpen" name="heroicons:bars-3" class="block h-6 w-6"
                                aria-hidden="true" />
                            <Icon v-else name="heroicons:x-mark" class="block h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </div>

            <!-- Mobile Navigation Menu -->
            <Transition name="slide-down">
                <div v-show="isMobileMenuOpen"
                    class="md:hidden bg-white dark:bg-gray-800 shadow-lg transition-all duration-300">
                    <div class="px-2 pt-2 pb-3 space-y-1">
                        <NuxtLink v-for="item in navigationItems" :key="item.name" :to="item.href"
                            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-amber-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-amber-400 dark:hover:bg-gray-700 transition-colors duration-200"
                            @click="isMobileMenuOpen = false">
                            {{ item.name }}
                        </NuxtLink>
                    </div>
                </div>
            </Transition>
        </header>

        <main class="pt-16">
            <slot />
        </main>

        <TheFooter />
    </div>
</template>

<script setup>
const isMobileMenuOpen = ref(false)

const navigationItems = [
    { name: 'About', href: '/#about' },
    { name: 'Experience', href: '/#experience' },
    { name: 'Projects', href: '/#projects' },
    { name: 'Contact', href: '/#contact' }
]
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
    transition: all 0.3s ease-in-out;
    max-height: 300px;
    overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
    max-height: 0;
    opacity: 0;
}
</style>
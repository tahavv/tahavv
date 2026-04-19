<template>
    <div class="min-h-screen bg-background text-text-primary relative overflow-hidden">
        
        <!-- Animated Aurora Background Elements -->
        <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            <div class="absolute top-0 -left-4 w-72 h-72 bg-primary-500 rounded-full mix-blend-screen filter blur-[128px] opacity-20 animate-blob"></div>
            <div class="absolute top-0 -right-4 w-72 h-72 bg-secondary-500 rounded-full mix-blend-screen filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>
            <div class="absolute -bottom-8 left-20 w-72 h-72 bg-primary-400 rounded-full mix-blend-screen filter blur-[128px] opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <!-- Floating Navigation Pill (Bottom on Mobile, Top on Desktop) -->
        <header class="fixed bottom-6 lg:bottom-auto lg:top-8 left-1/2 -translate-x-1/2 z-50">
            <nav class="flex items-center space-x-1 sm:space-x-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-2 sm:px-4 py-2 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
                <NuxtLink v-for="item in navigationItems" :key="item.name" :to="item.href"
                    class="relative px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium text-text-secondary hover:text-white transition-colors duration-300 group">
                    <span class="relative z-10">{{ item.name }}</span>
                    <!-- Hover pill background -->
                    <div class="absolute inset-0 bg-white/10 rounded-full scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 z-0"></div>
                </NuxtLink>
            </nav>
        </header>

        <main class="relative z-10 flex flex-col items-center">
            <slot />
        </main>

        <TheFooter />

    </div>
</template>

<script setup>
const navigationItems = [
    { name: 'About', href: '/#about' },
    { name: 'Experience', href: '/#experience' },
    { name: 'Projects', href: '/#projects' },
    { name: 'Certifications', href: '/#certifications' },
    { name: 'Contact', href: '/#contact' }
]
</script>

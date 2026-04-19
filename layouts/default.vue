<template>
    <div class="min-h-screen bg-background text-text-primary">
        
        <!-- Subtle Animated Background Grid -->
        <div class="fixed inset-0 z-0 pointer-events-none" style="background-image: radial-gradient(#1a1a1a 1px, transparent 1px); background-size: 32px 32px; opacity: 0.5;"></div>

        <!-- Floating Navigation Pill (Bottom on Mobile, Top on Desktop) -->
        <header class="fixed bottom-6 lg:bottom-auto lg:top-8 left-1/2 -translate-x-1/2 z-50">
            <nav class="flex items-center space-x-1 sm:space-x-2 bg-surface-50/80 backdrop-blur-xl border border-border rounded-full px-2 sm:px-4 py-2 shadow-2xl">
                <NuxtLink v-for="item in navigationItems" :key="item.name" :to="item.href"
                    class="relative px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium text-text-secondary hover:text-white transition-colors duration-300 group">
                    <span class="relative z-10">{{ item.name }}</span>
                    <!-- Hover pill background -->
                    <div class="absolute inset-0 bg-surface-200 rounded-full scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 z-0"></div>
                </NuxtLink>
            </nav>
        </header>

        <main class="relative z-10 flex flex-col items-center">
            <slot />
        </main>

    </div>
</template>

<script setup>
const navigationItems = [
    { name: 'About', href: '/#about' },
    { name: 'Experience', href: '/#experience' },
    { name: 'Projects', href: '/#projects' },
    { name: 'Contact', href: '/#contact' }
]

// Note: Removing Certifications from the primary dock to keep it extremely minimal.
// It will still be accessible via scrolling. Dark mode toggle is removed as the design is pure dark.
</script>
<template>
    <footer class="w-full relative z-10 py-8 px-4 border-t border-white/5 bg-background/80 backdrop-blur-md">
        <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <p class="text-sm text-text-muted font-medium">
                © {{ new Date().getFullYear() }} Taha Ayari. All rights reserved.
            </p>
            <div class="flex gap-4">
                <a :href="profile.github" target="_blank" rel="noopener noreferrer" class="text-text-muted hover:text-white transition-colors">
                    <Icon name="mdi:github" class="w-5 h-5" />
                </a>
                <a :href="profile.linkedin" target="_blank" rel="noopener noreferrer" class="text-text-muted hover:text-white transition-colors">
                    <Icon name="mdi:linkedin" class="w-5 h-5" />
                </a>
                <a v-if="profile.portfolio" :href="profile.portfolio" target="_blank" rel="noopener noreferrer" class="text-text-muted hover:text-white transition-colors">
                    <Icon name="mdi:web" class="w-5 h-5" />
                </a>
                <a v-if="profile.whatsapp" :href="profile.whatsapp" target="_blank" rel="noopener noreferrer" class="text-text-muted hover:text-white transition-colors">
                    <Icon name="mdi:whatsapp" class="w-5 h-5" />
                </a>
            </div>
        </div>
    </footer>
</template>

<script setup>
import { profile } from '~/content/profile'
</script>

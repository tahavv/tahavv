<script setup lang="ts">
import { profile } from '~/content/profile'

// Same-page links (these and every other #chapter link) go through the pixel wave in plugins/motion.client.ts.
const links = [
    { label: 'About', href: '/#about' },
    { label: 'Work', href: '/#work' },
    { label: 'Experience', href: '/#experience' },
    { label: 'Skills', href: '/#skills' }
]
</script>

<template>
    <header class="nav">
        <nav class="nav__bar" aria-label="Primary">
            <NuxtLink class="wordmark" to="/" aria-label="Taha Ayari, home">TAHA AYARI</NuxtLink>
            <ul class="nav__links">
                <li v-for="link in links" :key="link.href">
                    <NuxtLink :to="link.href">
                        {{ link.label }}
                        <span class="nav__plus" aria-hidden="true">
                            <svg viewBox="0 0 24 24" width="10" height="10"><path d="M12 5v14M5 12h14" /></svg>
                        </span>
                    </NuxtLink>
                </li>
            </ul>
            <div class="nav__tools">
                <!-- <MotionToggle /> -->
                <a class="nav__cv" :href="profile.cv" download>CV</a>
                <NuxtLink class="btn btn--lead btn--sm" to="/#contact">Get in touch</NuxtLink>
            </div>
        </nav>
    </header>
</template>

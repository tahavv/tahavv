<script setup lang="ts">
import { profile } from '~/content/profile'

const links = [
    { label: 'About', href: '/#about' },
    { label: 'Work', href: '/#work' },
    { label: 'Experience', href: '/#experience' },
    { label: 'Skills', href: '/#skills' }
]

const route = useRoute()
const { $motion } = useNuxtApp()

// On the home page, glide to the chapter instead of jumping.
function go(event: MouseEvent, href: string) {
    if (route.path !== '/' || !$motion) return
    event.preventDefault()
    $motion.scrollTo(href.slice(1))
    history.replaceState(null, '', href)
}
</script>

<template>
    <header class="nav">
        <nav class="container nav__bar" aria-label="Primary">
            <NuxtLink class="wordmark" to="/" aria-label="Taha Ayari, home">TAHA AYARI</NuxtLink>
            <ul class="nav__links">
                <li v-for="(link, index) in links" :key="link.href">
                    <NuxtLink :to="link.href" @click="go($event, link.href)">{{ link.label }}<span>{{ String(index + 1).padStart(2, '0') }}</span></NuxtLink>
                </li>
            </ul>
            <div class="nav__tools">
                <MotionToggle />
                <a class="btn btn--ghost btn--small" :href="profile.cv" download>CV</a>
                <NuxtLink class="btn btn--lead btn--small" to="/#contact" @click="go($event, '/#contact')">Get in touch</NuxtLink>
            </div>
        </nav>
    </header>
</template>

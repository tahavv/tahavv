<script setup lang="ts">
import { profile } from '~/content/profile'

const year = new Date().getFullYear()
</script>

<template>
    <footer class="footer" data-scene="exit">
        <div class="container">
            <div class="footer__row">
                <ul class="footer__links">
                    <li><a :href="`mailto:${profile.email}`">{{ profile.email }}</a></li>
                    <li><a :href="profile.github" rel="me noreferrer" target="_blank">GitHub</a></li>
                    <li><a :href="profile.linkedin" rel="me noreferrer" target="_blank">LinkedIn</a></li>
                    <li><a :href="profile.cv" download>CV, PDF</a></li>
                </ul>
                <p class="footer__legal">© {{ year }} Taha Ayari, {{ profile.location }}</p>
            </div>
            <p class="footer__mark" aria-hidden="true">TAHA AYARI</p>
        </div>
    </footer>
</template>

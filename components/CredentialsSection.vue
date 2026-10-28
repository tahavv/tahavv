<script setup lang="ts">
import { certifications, education } from '~/content/profile'
</script>

<template>
    <section id="credentials" class="section credentials" aria-labelledby="credentials-title" data-scene="conveyor" data-chapter="Education">
        <div class="container">
            <div class="credentials__head">
                <ChapterLabel no="06" name="Education" />
                <h2 id="credentials-title" data-chars>Degrees and certifications</h2>
            </div>
            <ul class="credentials__row" data-rise>
                <li class="credentials__photo">
                    <img src="/images/taha-iteam.jpeg" width="1200" height="1600" alt="Taha Ayari outside ITeam University, Tunis" loading="lazy">
                </li>
                <li v-for="entry in education" :key="entry.degree" class="card-white credential" data-tilt>
                    <span class="credential__meta">{{ entry.years }}</span>
                    <h3>{{ entry.degree }}</h3>
                    <p>{{ entry.school }}</p>
                </li>
                <li v-for="cert in certifications" :key="cert.name" class="card-white credential" data-tilt>
                    <span class="credential__meta">Certification</span>
                    <IconTile :name="cert.name.includes('Red Hat') ? 'RHCSA' : 'Linux'" size="sm" />
                    <a :href="cert.href" rel="noreferrer" target="_blank">{{ cert.name }}</a>
                </li>
            </ul>
        </div>
    </section>
</template>

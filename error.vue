<script setup lang="ts">
import type { NuxtError } from '#app'

// Every unknown URL answers 404 with this page; error pages are never indexed.
const props = defineProps<{ error: NuxtError }>()
const missing = computed(() => props.error.statusCode === 404)
const title = computed(() => (missing.value ? 'Page not found' : 'Something went wrong'))

useHead({
    title: () => `${title.value} | Taha Ayari`,
    meta: [{ name: 'robots', content: 'noindex, follow' }]
})

const home = () => clearError({ redirect: '/' })
</script>

<template>
    <NuxtLayout>
        <section class="section missing" aria-labelledby="missing-title">
            <div class="container missing__inner">
                <p class="chapter-label"><span class="chapter-label__no">{{ error.statusCode }}</span>{{ missing ? 'Not found' : 'Error' }}</p>
                <h1 id="missing-title">{{ title }}</h1>
                <p class="lead">{{ missing ? 'This address does not exist, or the page moved. The work, the experience and the CV are all on the home page.' : 'The page could not be shown. Try again, or go back to the home page.' }}</p>
                <div class="missing__actions">
                    <button class="btn btn--lead" type="button" @click="home">Back to the home page</button>
                    <a class="btn btn--ghost" href="/taha_ayari_cv_en.pdf" download>Download CV</a>
                </div>
            </div>
        </section>
    </NuxtLayout>
</template>

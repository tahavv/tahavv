<script setup lang="ts">
// Search engine ownership tags, only when their tokens are set in the environment.
const { public: { googleSiteVerification, bingSiteVerification } } = useRuntimeConfig()

useHead({
    meta: [
        ...(googleSiteVerification ? [{ name: 'google-site-verification', content: googleSiteVerification }] : []),
        ...(bingSiteVerification ? [{ name: 'msvalidate.01', content: bingSiteVerification }] : [])
    ]
})
</script>

<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>

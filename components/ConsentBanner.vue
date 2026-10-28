<script setup lang="ts">
// Asks once before Google Analytics may run. Only shown when GA4 is configured.
const { $analytics } = useNuxtApp()
const open = computed(() => Boolean($analytics?.enabled) && $analytics?.consent.value === null)
</script>

<template>
    <section v-if="open" class="consent" role="region" aria-labelledby="consent-title">
        <p id="consent-title" class="consent__title">Analytics cookies</p>
        <p class="consent__text">May I use Google Analytics to see which parts of this site are read? It sets cookies. Your choice is kept on this device.</p>
        <div class="consent__actions">
            <button class="btn btn--lead btn--sm" type="button" @click="$analytics?.choose('granted')">Accept</button>
            <button class="btn btn--ghost btn--sm" type="button" @click="$analytics?.choose('denied')">Decline</button>
        </div>
    </section>
</template>

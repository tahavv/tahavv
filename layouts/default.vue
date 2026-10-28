<script setup lang="ts">
// The 3D world is decoration: it loads once the page has finished loading and the reader first
// moves, scrolls or types (or after a few idle seconds), so its script and shaders never compete
// with the first paint or the first tap. Visitors who ask to save data never download it.
const world = shallowRef(false)

onMounted(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    if (connection?.saveData) return
    const events = ['pointermove', 'pointerdown', 'scroll', 'keydown', 'touchstart'] as const
    let timer: ReturnType<typeof setTimeout> | undefined
    const start = () => {
        clearTimeout(timer)
        events.forEach((name) => window.removeEventListener(name, start))
        world.value = true
    }
    const ready = () => {
        events.forEach((name) => window.addEventListener(name, start, { once: true, passive: true }))
        timer = setTimeout(() => {
            if ('requestIdleCallback' in window) requestIdleCallback(start, { timeout: 2000 })
            else start()
        }, 3500)
    }
    if (document.readyState === 'complete') ready()
    else window.addEventListener('load', ready, { once: true })
})
</script>

<template>
    <div class="site">
        <a class="skip" href="#main">Skip to content</a>
        <div class="backdrop" aria-hidden="true"></div>
        <ClientOnly>
            <LazySceneWorld v-if="world" />
            <ChapterIndicator />
            <CursorCta />
            <ConsentBanner />
        </ClientOnly>
        <SiteNav />
        <main id="main">
            <slot />
        </main>
        <SiteFooter />
    </div>
</template>

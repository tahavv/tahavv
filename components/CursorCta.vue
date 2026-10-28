<script setup lang="ts">
// A design-tool cursor parked in the corner, after the reference: it drifts, says one line,
// and leads to the contact form (through the pixel wave, like every #chapter link).
// It shows once the hero is behind and hides at the contact chapter.
const visible = shallowRef(false)
let frame = 0

function update() {
    frame = 0
    const contact = document.getElementById('contact')
    const atContact = contact ? contact.getBoundingClientRect().top < window.innerHeight * 0.9 : false
    visible.value = window.scrollY > window.innerHeight * 0.8 && !atContact
}

const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }

onMounted(() => {
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
    cancelAnimationFrame(frame)
})
</script>

<template>
    <a class="cursor-cta" :class="{ 'is-visible': visible }" href="/#contact" tabindex="-1" aria-hidden="true">
        <span class="cursor-cta__float">
            <span v-if="visible" class="cursor-cta__bubble">Hiring? Let’s talk.</span>
            <span class="cursor-cta__tool">
                <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M2.5 2.5l13.5 6.8-5.8 1.6-2.7 5.6z" /></svg>
            </span>
            <span class="cursor-cta__name">TAHA</span>
        </span>
    </a>
</template>

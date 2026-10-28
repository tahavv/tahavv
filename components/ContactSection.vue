<script setup lang="ts">
import { profile } from '~/content/profile'

const form = reactive({ name: '', email: '', subject: '', message: '', website: '' })
const state = shallowRef<'idle' | 'sending' | 'success' | 'error'>('idle')
const feedback = shallowRef('')
const formEl = ref<HTMLFormElement | null>(null)

async function submit() {
    const firstInvalid = formEl.value?.querySelector<HTMLElement>(':invalid')
    if (firstInvalid) {
        state.value = 'error'
        feedback.value = 'Fill in every field, with an email written as name@example.com.'
        firstInvalid.focus()
        return
    }
    state.value = 'sending'
    feedback.value = 'Sending…'
    try {
        const response = await $fetch<{ message: string }>('/api/contact', { method: 'POST', body: form })
        state.value = 'success'
        useNuxtApp().$analytics?.track('generate_lead', { form: 'contact' })
        feedback.value = response.message
        Object.assign(form, { name: '', email: '', subject: '', message: '', website: '' })
    } catch (error: any) {
        state.value = 'error'
        feedback.value = error?.data?.statusMessage || 'The message did not go through. Try again in a minute, or email me directly.'
    }
}
</script>

<template>
    <section id="contact" class="section contact" aria-labelledby="contact-title" data-scene="horizon" data-chapter="Contact">
        <div class="container contact__grid">
            <div class="contact__text">
                <ChapterLabel no="07" name="Contact" />
                <h2 id="contact-title" data-chars>Your next platform, with Taha.</h2>
                <p class="contact__lead" data-reveal>Hiring for a full-stack, cloud or DevOps role? I’m open to new opportunities, remote or in Tunis. Send a message, email me, or download my CV.</p>
                <dl class="contact__facts" data-reveal>
                    <div><dt>Email</dt><dd><a :href="`mailto:${profile.email}`">{{ profile.email }}</a></dd></div>
                    <div><dt>LinkedIn</dt><dd><a :href="profile.linkedin" rel="me noreferrer" target="_blank">in/taha-ayari/</a></dd></div>
                    <div><dt>GitHub</dt><dd><a :href="profile.github" rel="me noreferrer" target="_blank">tahavv</a></dd></div>
                    <div><dt>CV</dt><dd><a :href="profile.cv" download>Download the PDF</a></dd></div>
                    <div><dt>Based in</dt><dd>{{ profile.location }}</dd></div>
                </dl>
            </div>
            <div class="contact__side" data-rise>
                <form ref="formEl" class="form card-white" novalidate @submit.prevent="submit">
                    <div class="form__head">
                        <NuxtImg :src="profile.image" width="52" height="52" densities="x1 x2" alt="Portrait of Taha Ayari" loading="lazy" decoding="async" />
                        <p><strong>Taha Ayari</strong><span>Software engineer, {{ profile.location }}</span></p>
                    </div>
                    <div class="form__trap" aria-hidden="true">
                        <label for="contact-website">Website</label>
                        <input id="contact-website" v-model="form.website" name="website" tabindex="-1" autocomplete="off">
                    </div>
                    <div class="form__pair">
                        <div class="field">
                            <label for="contact-name">Name</label>
                            <input id="contact-name" v-model.trim="form.name" name="name" required autocomplete="name" maxlength="120">
                        </div>
                        <div class="field">
                            <label for="contact-email">Email</label>
                            <input id="contact-email" v-model.trim="form.email" name="email" type="email" required autocomplete="email" inputmode="email" maxlength="254">
                        </div>
                    </div>
                    <div class="field">
                        <label for="contact-subject">Subject</label>
                        <input id="contact-subject" v-model.trim="form.subject" name="subject" required maxlength="180">
                    </div>
                    <div class="field">
                        <label for="contact-message">Message</label>
                        <textarea id="contact-message" v-model.trim="form.message" name="message" required maxlength="5000" rows="5"></textarea>
                    </div>
                    <div class="form__actions">
                        <button class="btn btn--lead" type="submit" :disabled="state === 'sending'" :aria-busy="state === 'sending'">
                            {{ state === 'sending' ? 'Sending' : 'Send message' }}
                        </button>
                        <p class="form__feedback" :class="`is-${state}`" role="status" aria-live="polite">{{ feedback }}</p>
                    </div>
                </form>
            </div>
        </div>
    </section>
</template>

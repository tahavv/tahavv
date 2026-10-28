<script setup lang="ts">
import { gsap } from 'gsap'
import { layers } from '~/content/profile'

// The skills chapter, pinned: the stack as five layers that pull apart, top to bottom,
// each one lighting as its row in the list comes up.
const root = ref<HTMLElement | null>(null)
const active = shallowRef(0)

usePinnedTimeline(root, layers.length * 0.8, (timeline, element) => {
    const select = gsap.utils.selector(element)
    timeline
        .fromTo(select('.stack__layer'), { '--lift': 0 }, { '--lift': 1, duration: 1, stagger: 0.04 })
        .fromTo(select('.stack__panel'), { opacity: 0.4, y: 60 }, { opacity: 1, y: 0, duration: 0.3 }, 0)
}, (progress) => { active.value = Math.min(layers.length - 1, Math.floor(progress * layers.length)) })
</script>

<template>
    <section id="skills" ref="root" class="stack" aria-labelledby="skills-title" data-scene="layers" data-chapter="Skills">
        <div class="container stack__inner">
            <div class="stack__head">
                <ChapterLabel no="05" name="Skills" />
                <h2 id="skills-title" data-chars>One engineer, every layer</h2>
                <p>From the cloud account to the button on the screen, the whole stack on one desk.</p>
            </div>
            <div class="stack__panel">
                <div class="stack__art" aria-hidden="true">
                    <div class="stack__iso">
                        <div
                            v-for="(layer, index) in layers"
                            :key="layer.name"
                            class="stack__layer"
                            :class="{ 'is-active': index === active }"
                            :style="{ '--i': index, '--n': layers.length }"
                        >
                            <span class="stack__layer-name">{{ layer.name }}</span>
                            <span class="stack__layer-icons">
                                <IconTile v-for="name in layer.icons" :key="name" :name="name" size="sm" />
                            </span>
                        </div>
                    </div>
                </div>
                <ol class="stack__list">
                    <li v-for="(layer, index) in layers" :key="layer.name" :class="{ 'is-active': index === active }">
                        <p class="stack__row-name"><span>{{ String(index + 1).padStart(2, '0') }}</span>{{ layer.name }}</p>
                        <p class="stack__row-items">{{ layer.items.join(', ') }}</p>
                    </li>
                </ol>
            </div>
        </div>
    </section>
</template>

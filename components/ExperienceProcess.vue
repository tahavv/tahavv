<script setup lang="ts">
import { gsap } from 'gsap'
import { experience } from '~/content/profile'

// The experience chapter is ordered from the latest role back through earlier work.
const root = ref<HTMLElement | null>(null)
const roles = experience
const active = shallowRef(0)
const nodes = [
    { x: 80, y: 250 }, { x: 330, y: 150 }, { x: 590, y: 230 }, { x: 860, y: 110 }
]
const path = `M ${nodes[0].x} ${nodes[0].y} C 200 250, 210 150, ${nodes[1].x} ${nodes[1].y} S 470 230, ${nodes[2].x} ${nodes[2].y} S 740 110, ${nodes[3].x} ${nodes[3].y}`

usePinnedTimeline(root, roles.length, (timeline, element) => {
    const line = element.querySelector<SVGPathElement>('.process__line')
    const length = line?.getTotalLength() ?? 1200
    const select = gsap.utils.selector(element)
    timeline
        .fromTo(select('.process__line'), { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, duration: 1 })
        .from(select('.process__node'), { scale: 0, opacity: 0, transformOrigin: '50% 50%', stagger: 0.3, duration: 0.15 }, 0)
}, (progress) => { active.value = Math.min(roles.length - 1, Math.floor(progress * roles.length)) })
</script>

<template>
    <section id="experience" ref="root" class="process" aria-labelledby="experience-title" data-scene="plan" data-chapter="Experience">
        <div class="container process__grid">
            <div class="process__intro">
                <ChapterLabel no="03" name="Experience" />
                <h2 id="experience-title" data-chars>Four roles, two companies</h2>
                <p>3+ years of production work, from an internship in 2022 to owning delivery pipelines today.</p>
            </div>

            <ol class="process__cards">
                <li v-for="(role, index) in roles" :key="role.start" class="step" :class="{ 'is-active': index === active }">
                    <p class="step__meta"><span>{{ String(index + 1).padStart(2, '0') }}</span><time :datetime="role.start">{{ role.period }}</time></p>
                    <h3>{{ role.role }}</h3>
                    <p class="step__company">{{ role.company }}, {{ role.place }}</p>
                    <ul class="step__points">
                        <li v-for="point in role.highlights" :key="point">{{ point }}</li>
                    </ul>
                    <p class="step__stack">{{ role.stack.join(', ') }}</p>
                    <span class="step__bar" aria-hidden="true"><span v-for="n in roles.length" :key="n" :class="{ 'is-on': n - 1 <= index }"></span></span>
                </li>
            </ol>

            <svg class="process__map" viewBox="0 0 940 360" aria-hidden="true">
                <path class="process__track" :d="path" />
                <path class="process__line" :d="path" />
                <g v-for="(node, index) in nodes" :key="index" class="process__node" :class="{ 'is-active': index <= active }">
                    <rect :x="node.x - 18" :y="node.y - 18" width="36" height="36" rx="8" />
                    <text :x="node.x" :y="node.y + 46" text-anchor="middle">{{ roles[index].start.slice(0, 4) }}</text>
                    <text class="process__node-role" :x="node.x" :y="node.y + 66" text-anchor="middle">{{ roles[index].company }}</text>
                </g>
            </svg>
        </div>
    </section>
</template>

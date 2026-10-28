<script setup lang="ts">
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import {
    siKubernetes, siTerraform, siDocker, siArgo, siGrafana, siPrometheus, siJenkins, siAnsible, siGooglecloud,
    siSpringboot, siAngular, siVuedotjs, siTypescript, siPostgresql, siApachekafka, siRedis, siNextdotjs, siPython
} from 'simple-icons'

// One world behind the dark chapters. Each chapter names a formation in data-scene; as
// the reader scrolls, the tiles glide from one formation to the next over a drawn floor,
// under a diagonal beam of light. In the light chapters and the skills chapter the tiles
// leave the frame, so they never sit behind the text.
const canvas = ref<HTMLCanvasElement | null>(null)
const { paused, restore } = useMotion()
const { $motion } = useNuxtApp()

const icons = [siKubernetes, siTerraform, siArgo, siDocker, siGrafana, siPrometheus, siJenkins, siAnsible, siGooglecloud,
    siSpringboot, siAngular, siVuedotjs, siTypescript, siPostgresql, siApachekafka, siRedis, siNextdotjs, siPython]

type Formation = 'hero' | 'ring' | 'away' | 'floor' | 'process' | 'cluster' | 'exit'

let renderer: THREE.WebGLRenderer | undefined
let frame = 0
const cleanups: (() => void)[] = []

function token(name: string) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

// Paint one pixel and read it back: works for oklch and every other colour syntax.
function cssColour(value: string) {
    const surface = document.createElement('canvas')
    surface.width = surface.height = 1
    const ctx = surface.getContext('2d', { willReadFrequently: true })!
    ctx.fillStyle = '#000'
    ctx.fillStyle = value
    ctx.fillRect(0, 0, 1, 1)
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
    return new THREE.Color().setRGB(r / 255, g / 255, b / 255, THREE.SRGBColorSpace)
}

function iconTexture(path: string, colour: THREE.Color) {
    const size = 256
    const surface = document.createElement('canvas')
    surface.width = surface.height = size
    const ctx = surface.getContext('2d')!
    ctx.translate(size * 0.26, size * 0.26)
    ctx.scale((size * 0.48) / 24, (size * 0.48) / 24)
    ctx.fillStyle = `#${colour.getHexString()}`
    ctx.fill(new Path2D(path))
    const texture = new THREE.CanvasTexture(surface)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 4
    return texture
}

function spriteTexture(draw: (ctx: CanvasRenderingContext2D, size: number) => void, size = 128) {
    const surface = document.createElement('canvas')
    surface.width = surface.height = size
    draw(surface.getContext('2d')!, size)
    return new THREE.CanvasTexture(surface)
}

const smooth = (a: number, b: number, x: number) => {
    const t = Math.min(Math.max((x - a) / (b - a), 0), 1)
    return t * t * (3 - 2 * t)
}
const hash = (n: number) => {
    const s = Math.sin(n * 127.1) * 43758.5453
    return s - Math.floor(s)
}

onMounted(() => {
    if (!canvas.value) return
    restore()
    const reduced = $motion?.reduced ?? matchMedia('(prefers-reduced-motion: reduce)').matches
    const small = matchMedia('(max-width: 60rem)').matches

    renderer = new THREE.WebGLRenderer({ canvas: canvas.value, antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.5 : 1.75))
    renderer.toneMapping = THREE.NeutralToneMapping
    renderer.outputColorSpace = THREE.SRGBColorSpace

    const scene = new THREE.Scene()
    const pmrem = new THREE.PMREMGenerator(renderer)
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 160)
    camera.position.set(0, 1.5, small ? 24 : 18)

    const key = new THREE.DirectionalLight(0xffffff, 1.5)
    key.position.set(4, 10, 10)
    const rim = new THREE.PointLight(0xffffff, 70, 60)
    rim.position.set(10, 4, 4)
    scene.add(key, rim, new THREE.AmbientLight(0xffffff, 0.35))

    // The floor: a wide grid of hairlines with a plus at each crossing, seen at a low angle.
    const floor = new THREE.Group()
    const span = 80
    const cell = 4
    const lines: number[] = []
    const crosses: number[] = []
    for (let v = -span; v <= span; v += cell) {
        lines.push(v, 0, -span, v, 0, span, -span, 0, v, span, 0, v)
        for (let w = -span; w <= span; w += cell) crosses.push(v, 0.01, w)
    }
    const lineGeometry = new THREE.BufferGeometry()
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(lines, 3))
    const lineMaterial = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.1, depthWrite: false })
    const crossGeometry = new THREE.BufferGeometry()
    crossGeometry.setAttribute('position', new THREE.Float32BufferAttribute(crosses, 3))
    const crossMaterial = new THREE.PointsMaterial({
        size: 0.55, transparent: true, opacity: 0.8, depthWrite: false,
        map: spriteTexture((ctx, s) => { ctx.fillStyle = '#fff'; ctx.fillRect(s / 2 - 2.5, 10, 5, s - 20); ctx.fillRect(10, s / 2 - 2.5, s - 20, 5) }, 64)
    })
    floor.add(new THREE.LineSegments(lineGeometry, lineMaterial), new THREE.Points(crossGeometry, crossMaterial))
    floor.position.set(0, -5, -14)
    floor.rotation.set(0.12, 0.35, 0)
    scene.add(floor)

    // The beam: a long soft blade of blue light falling across the frame.
    const beamMaterial = new THREE.SpriteMaterial({
        transparent: true, depthWrite: false, opacity: 0.55,
        map: spriteTexture((ctx, s) => {
            const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2)
            g.addColorStop(0, 'rgba(255,255,255,0.95)'); g.addColorStop(0.35, 'rgba(255,255,255,0.4)'); g.addColorStop(1, 'rgba(255,255,255,0)')
            ctx.fillStyle = g; ctx.fillRect(0, 0, s, s)
        }, 256)
    })
    const beam = new THREE.Sprite(beamMaterial)
    beam.scale.set(14, 46, 1)
    beamMaterial.rotation = -0.55
    scene.add(beam)

    // The tiles.
    const count = small ? 12 : icons.length
    const tileGeometry = new RoundedBoxGeometry(1.45, 1.45, 0.36, 6, 0.22)
    const faceGeometry = new THREE.PlaneGeometry(1.45, 1.45)
    const tileMaterial = new THREE.MeshPhysicalMaterial({ roughness: 0.2, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.08, transparent: true })
    const altMaterial = new THREE.MeshPhysicalMaterial({ roughness: 0.25, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.1, transparent: true })
    const faces: THREE.MeshBasicMaterial[] = []
    const tiles: { mesh: THREE.Group, current: THREE.Vector3, phase: number }[] = []
    for (let i = 0; i < count; i += 1) {
        const lead = i % 4 !== 2
        const mesh = new THREE.Group()
        mesh.add(new THREE.Mesh(tileGeometry, lead ? tileMaterial : altMaterial))
        const face = new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false })
        face.userData = { path: icons[i].path }
        faces.push(face)
        const plane = new THREE.Mesh(faceGeometry, face)
        plane.position.z = 0.185
        mesh.add(plane)
        scene.add(mesh)
        tiles.push({ mesh, current: new THREE.Vector3(0, 20, -20), phase: i * 0.9 })
    }

    function applyTheme() {
        tileMaterial.color.copy(cssColour(token('--scene-tile')))
        altMaterial.color.copy(cssColour(token('--scene-tile-2')))
        const line = cssColour(token('--scene-line'))
        lineMaterial.color.copy(line)
        crossMaterial.color.copy(line)
        beamMaterial.color.copy(cssColour(token('--color-glow')))
        rim.color.copy(tileMaterial.color)
        const icon = cssColour(token('--scene-icon'))
        faces.forEach((face) => {
            face.map?.dispose()
            face.map = iconTexture(face.userData.path, icon)
            face.needsUpdate = true
        })
    }
    applyTheme()

    // Where each tile stands in each formation at time t.
    function place(name: Formation, i: number, t: number, out: THREE.Vector3) {
        const u = count === 1 ? 0.5 : i / (count - 1)
        const a = (i / count) * Math.PI * 2
        switch (name) {
            case 'hero':
                return out.set((u - 0.5) * (small ? 8 : 17), (small ? 5 : 2.2) + Math.cos((u - 0.5) * Math.PI) * 1.4 + (i % 2) * 0.9, -2.5 + Math.sin(i * 1.7) * 2.4)
            case 'ring':
                return out.set(Math.cos(a + 0.4 + t * 0.05) * (small ? 6 : 11), Math.sin(a + 0.4 + t * 0.05) * (small ? 10 : 6) + 1, (small ? -14 : -3) + Math.sin(i * 2.3) * 1.5)
            case 'floor': {
                const cols = small ? 4 : 6
                const c = i % cols; const r = Math.floor(i / cols)
                return out.set((c - (cols - 1) / 2) * 4.2 + (r % 2) * 1.6, -7.5, -10 - r * 4)
            }
            case 'process':
                return out.set((hash(i) - 0.5) * (small ? 14 : 40), (hash(i + 4) > 0.5 ? 1 : -1) * (6 + hash(i + 6) * 5), -18 + (hash(i + 8) - 0.5) * 6)
            case 'cluster':
                return out.set((small ? 0 : 8.5) + (hash(i) - 0.5) * 6, (small ? 5.5 : 0.5) + (hash(i + 3) - 0.5) * 6, -6 + (hash(i + 5) - 0.5) * 4)
            case 'away':
                return out.set((hash(i) - 0.5) * 34, 16 + hash(i + 2) * 8, -22)
            case 'exit':
                return out.set((hash(i) - 0.5) * 30, 18 + hash(i + 2) * 8, -20)
        }
    }
    const lying = (name: Formation) => (name === 'floor' ? 1 : 0)
    const shown = (name: Formation) => (name === 'away' || name === 'exit' ? 0 : 1)
    const beamSpots: Record<Formation, [number, number, number]> = {
        hero: [9, 3, -12], ring: [6, 0, -14], away: [10, 6, -18], floor: [-8, 2, -16], process: [9, 1, -14], cluster: [10, 0, -12], exit: [0, 8, -18]
    }
    const floorWeight: Record<Formation, number> = { hero: 1, ring: 0.7, away: 0.2, floor: 1, process: 1, cluster: 0.8, exit: 0.4 }

    // Chapters: every [data-scene], measured on its pin spacer when it is pinned.
    let chapters: { name: Formation, centre: number }[] = []
    function readChapters() {
        chapters = [...document.querySelectorAll<HTMLElement>('[data-scene]')].map((element) => {
            const box = (element.parentElement?.classList.contains('pin-spacer') ? element.parentElement : element).getBoundingClientRect()
            return { name: (element.dataset.scene as Formation) || 'hero', centre: box.top + window.scrollY + box.height / 2 }
        })
        if (!chapters.length) chapters = [{ name: 'hero', centre: 0 }]
    }
    readChapters()
    window.addEventListener('chapters:refresh', readChapters)
    cleanups.push(() => window.removeEventListener('chapters:refresh', readChapters))

    function blend() {
        const centre = window.scrollY + window.innerHeight / 2
        let k = 0
        while (k < chapters.length - 1 && chapters[k + 1].centre <= centre) k += 1
        const a = chapters[k]
        const b = chapters[Math.min(k + 1, chapters.length - 1)]
        const raw = a === b || centre <= a.centre ? 0 : (centre - a.centre) / (b.centre - a.centre)
        return { a: a.name, b: b.name, t: smooth(0.25, 0.75, raw) }
    }

    const pointer = { x: 0, y: 0 }
    const onPointer = (event: PointerEvent) => { pointer.x = event.clientX / window.innerWidth - 0.5; pointer.y = event.clientY / window.innerHeight - 0.5 }
    window.addEventListener('pointermove', onPointer, { passive: true })
    cleanups.push(() => window.removeEventListener('pointermove', onPointer))

    const from = new THREE.Vector3()
    const to = new THREE.Vector3()
    const target = new THREE.Vector3()
    const beamTarget = new THREE.Vector3()
    let visible = 0
    let flat = 0
    let floorOpacity = 1
    let firstFrame = true

    function render(time: number) {
        if (!renderer) return
        const t = reduced ? 0 : time / 1000
        const still = reduced || paused.value
        const { a, b, t: mix } = blend()
        const ease = firstFrame || still ? 1 : 0.06

        visible += ((shown(a) + (shown(b) - shown(a)) * mix) - visible) * ease
        flat += ((lying(a) + (lying(b) - lying(a)) * mix) - flat) * ease
        tileMaterial.opacity = visible
        altMaterial.opacity = visible
        faces.forEach((face) => { face.opacity = visible })

        tiles.forEach((tile, i) => {
            place(a, i, t, from)
            place(b, i, t, to)
            target.lerpVectors(from, to, mix)
            tile.current.lerp(target, ease)
            tile.mesh.position.copy(tile.current)
            if (!still) tile.mesh.position.y += Math.sin(t * 0.8 + tile.phase) * 0.16 * (1 - flat)
            const rx = 0.2 * Math.sin(i) + (still ? 0 : Math.sin(t * 0.5 + tile.phase) * 0.1)
            const ry = -0.45 + (i / count) * 0.9 + (still ? 0 : Math.cos(t * 0.4 + tile.phase) * 0.12)
            const rz = 0.15 * Math.cos(i * 1.3)
            tile.mesh.rotation.set(rx + flat * (-Math.PI / 2 - rx), ry * (1 - flat) + flat * 0.35, rz * (1 - flat))
            tile.mesh.visible = visible > 0.02
        })

        const ba = beamSpots[a]; const bb = beamSpots[b]
        beamTarget.set(ba[0] + (bb[0] - ba[0]) * mix, ba[1] + (bb[1] - ba[1]) * mix, ba[2] + (bb[2] - ba[2]) * mix)
        beam.position.lerp(beamTarget, firstFrame ? 1 : 0.04)
        floorOpacity += ((floorWeight[a] + (floorWeight[b] - floorWeight[a]) * mix) - floorOpacity) * ease
        lineMaterial.opacity = 0.1 * floorOpacity
        crossMaterial.opacity = 0.8 * floorOpacity
        // The floor slides toward the reader as the page goes down.
        floor.position.z = -14 + ((window.scrollY * 0.004) % cell)

        if (!still) {
            camera.position.x += (pointer.x * 1.6 - camera.position.x) * 0.04
            camera.position.y += (1.5 - pointer.y * 1 - camera.position.y) * 0.04
        }
        camera.lookAt(0, 0.5, -4)
        renderer.render(scene, camera)
        firstFrame = false
    }

    function resize() {
        if (!renderer) return
        renderer.setSize(window.innerWidth, window.innerHeight, false)
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        readChapters()
        render(performance.now())
    }

    let running = false
    function loop(time: number) {
        frame = requestAnimationFrame(loop)
        render(time)
    }
    function sync() {
        const run = !reduced && !paused.value && document.visibilityState === 'visible'
        if (run && !running) { running = true; frame = requestAnimationFrame(loop) }
        if (!run && running) { running = false; cancelAnimationFrame(frame); render(performance.now()) }
    }
    // Without the loop, the world still follows the page, one frame per scroll.
    const onScroll = () => { if (!running) render(performance.now()) }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', sync)
    cleanups.push(() => {
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', resize)
        document.removeEventListener('visibilitychange', sync)
    })
    cleanups.push(watch(paused, sync))

    resize()
    sync()
    canvas.value.classList.add('is-ready')

    cleanups.push(() => {
        [tileGeometry, faceGeometry, lineGeometry, crossGeometry].forEach((g) => g.dispose());
        [tileMaterial, altMaterial, lineMaterial, crossMaterial, beamMaterial].forEach((m) => m.dispose())
        faces.forEach((face) => { face.map?.dispose(); face.dispose() })
        pmrem.dispose()
    })
})

onBeforeUnmount(() => {
    cancelAnimationFrame(frame)
    cleanups.forEach((cleanup) => cleanup())
    renderer?.dispose()
})
</script>

<template>
    <canvas ref="canvas" class="world" aria-hidden="true"></canvas>
</template>

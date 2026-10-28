<script setup lang="ts">
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import {
    siKubernetes, siTerraform, siDocker, siArgo, siGrafana, siPrometheus, siJenkins, siAnsible, siGooglecloud,
    siSpringboot, siAngular, siVuedotjs
} from 'simple-icons'
import { formations, frameFor, keys, start, type Formation, type Frame } from '~/lib/sceneFrames'
import { dustFragment, dustVertex, gridFragment, gridVertex, skyFragment, skyVertex } from '~/lib/sceneShaders'

// One world behind every chapter, after the reference. Each section names a frame in
// data-scene (lib/sceneFrames.ts). The scroll position picks a blend of two frames, every
// setting eases toward it, and the camera sways with the scroll and the pointer. The sky,
// the grid and the dust all fade from night to day with the frame's light value, so a
// light chapter arrives through blue instead of cutting from black to white.
const canvas = ref<HTMLCanvasElement | null>(null)
const { paused, restore } = useMotion()
const { $motion } = useNuxtApp()

const icons = [siKubernetes, siTerraform, siArgo, siDocker, siGrafana, siPrometheus, siJenkins, siAnsible, siGooglecloud, siSpringboot, siAngular, siVuedotjs]
const COUNT = icons.length
const CELL = 36 / 24
const LAYER_GAP = 2.4
const TRANSITION = 2.2
const degree = Math.PI / 180

let renderer: THREE.WebGLRenderer | undefined
let frame = 0
let disposed = false
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

function canvasTexture(draw: (ctx: CanvasRenderingContext2D) => void) {
    const surface = document.createElement('canvas')
    surface.width = surface.height = 256
    draw(surface.getContext('2d')!)
    const texture = new THREE.CanvasTexture(surface)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 4
    return texture
}

const damp = (from: number, to: number, lambda: number, dt: number) => from + (to - from) * (1 - Math.exp(-lambda * dt))
const clamp = (x: number, min: number, max: number) => Math.min(max, Math.max(min, x))
const smooth = (a: number, b: number, x: number) => {
    const t = clamp((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)
}
const ease = (t: number) => t * 0.7 + t * t * (3 - 2 * t) * 0.3
const hash = (n: number) => {
    const s = Math.sin(n * 127.1) * 43758.5453
    return s - Math.floor(s)
}

// Setting the world up is split into short steps that hand the main thread back in between,
// so building it never blocks a tap or a scroll for long.
const pause = () => new Promise<void>((resolve) => setTimeout(resolve, 0))

onMounted(async () => {
    if (!canvas.value) return
    restore()
    const reduced = $motion?.reduced ?? matchMedia('(prefers-reduced-motion: reduce)').matches
    const root = document.documentElement

    renderer = new THREE.WebGLRenderer({ canvas: canvas.value, antialias: true, powerPreference: 'high-performance' })
    // Fewer pixels and less dust on phones and low-power devices: the sky and grid shaders run per pixel.
    const nav = navigator as Navigator & { deviceMemory?: number }
    const lowPower = window.innerWidth < 768 || (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowPower ? 1 : 1.5))
    renderer.toneMapping = THREE.NoToneMapping
    renderer.outputColorSpace = THREE.SRGBColorSpace
    await pause()
    if (disposed) return

    const scene = new THREE.Scene()
    const pmrem = new THREE.PMREMGenerator(renderer)
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    pmrem.dispose()
    await pause()
    if (disposed) return
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 160)
    camera.position.set(0, 2.2, 9)
    const fill = new THREE.DirectionalLight(0xffffff, 1.05)
    fill.position.set(4, 7, 6)
    const back = new THREE.DirectionalLight(0x9fc2ff, 0.35)
    back.position.set(-6, 2, -2)
    scene.add(new THREE.AmbientLight(0xffffff, 0.55), fill, back)

    // The sky.
    const skyUniforms = {
        uTime: { value: 0 }, uLight: { value: 0 }, uPhase: { value: 0 },
        uFirst: { value: new THREE.Color() }, uSecond: { value: new THREE.Color() }, uThird: { value: new THREE.Color() },
        uFirstLight: { value: new THREE.Color() }, uSecondLight: { value: new THREE.Color() }, uThirdLight: { value: new THREE.Color() }
    }
    const skyGeometry = new THREE.SphereGeometry(64, 64, 32)
    const skyMaterial = new THREE.ShaderMaterial({ uniforms: skyUniforms, vertexShader: skyVertex, fragmentShader: skyFragment, side: THREE.BackSide, depthWrite: false })
    const sky = new THREE.Mesh(skyGeometry, skyMaterial)
    sky.frustumCulled = false
    sky.renderOrder = -10
    scene.add(sky)

    await pause()
    if (disposed) return
    // The grid: one sheet, or three stacked when a frame asks for layers.
    const sheet = new THREE.Object3D()
    const gridUniforms = {
        uTime: { value: 0 }, uWave: { value: 0 }, uCurl: { value: 0 }, uExtent: { value: 1 },
        uFocus: { value: new THREE.Vector2() }, uFocusAmp: { value: 0 }, uBlue: { value: new THREE.Color() },
        uSize: { value: 36 }, uCells: { value: 24 }, uFlow: { value: 0 }, uLight: { value: 0 },
        uLineDark: { value: new THREE.Color() }, uLineLight: { value: new THREE.Color() }
    }
    const gridGeometry = new THREE.PlaneGeometry(36, 36, 144, 144)
    gridGeometry.rotateX(-Math.PI / 2)
    const levels = [-1, 0, 1]
    const gridMaterials = levels.map(() => new THREE.ShaderMaterial({
        uniforms: { ...gridUniforms, uOpacity: { value: 1 } },
        vertexShader: gridVertex, fragmentShader: gridFragment,
        transparent: true, depthWrite: false, side: THREE.DoubleSide
    }))
    const gridGroup = new THREE.Group()
    const gridMeshes = gridMaterials.map((material) => {
        const mesh = new THREE.Mesh(gridGeometry, material)
        mesh.frustumCulled = false
        gridGroup.add(mesh)
        return mesh
    })
    scene.add(gridGroup)

    await pause()
    if (disposed) return
    // The dust.
    const DUST = lowPower ? 700 : 1800
    const box = new THREE.Vector3(26, 15, 26)
    const dustPositions = new Float32Array(DUST * 3)
    const dustSeeds = new Float32Array(DUST)
    for (let i = 0; i < DUST; i += 1) {
        const s = 17 + i * 4
        dustPositions[i * 3] = (hash(s) * 2 - 1) * box.x
        dustPositions[i * 3 + 1] = (hash(s + 1) * 2 - 1) * box.y
        dustPositions[i * 3 + 2] = (hash(s + 2) * 2 - 1) * box.z
        dustSeeds[i] = hash(s + 3)
    }
    const dustGeometry = new THREE.BufferGeometry()
    dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3))
    dustGeometry.setAttribute('aSeed', new THREE.BufferAttribute(dustSeeds, 1))
    const dustUniforms = {
        uTime: { value: 0 }, uProj: { value: 1 }, uSize: { value: 0.07 }, uTravel: { value: 0 },
        uCenter: { value: new THREE.Vector3() }, uBox: { value: box },
        uDark: { value: new THREE.Color() }, uLight: { value: new THREE.Color() }, uLightMix: { value: 0 }, uOpacity: { value: 0 }
    }
    const dustMaterial = new THREE.ShaderMaterial({ uniforms: dustUniforms, vertexShader: dustVertex, fragmentShader: dustFragment, transparent: true, depthWrite: false })
    const dust = new THREE.Points(dustGeometry, dustMaterial)
    dust.frustumCulled = false
    scene.add(dust)

    await pause()
    if (disposed) return
    // The tiles: blue sides, a gradient face, the stack's logo in white.
    const tileGeometry = new RoundedBoxGeometry(1, 1, 0.24, 4, 0.06)
    const iconGeometry = new THREE.PlaneGeometry(0.58, 0.58)
    const sideMaterial = new THREE.MeshPhysicalMaterial({ roughness: 0.3, clearcoat: 0.8, envMapIntensity: 0.9 })
    const faceMaterial = new THREE.MeshPhysicalMaterial({ roughness: 0.28, clearcoat: 0.8, clearcoatRoughness: 0.06, envMapIntensity: 0.8 })
    const tileMaterials = [sideMaterial, sideMaterial, sideMaterial, sideMaterial, faceMaterial, sideMaterial]
    const iconMaterials: THREE.MeshBasicMaterial[] = []
    const tiles = icons.map((icon, i) => {
        const group = new THREE.Group()
        group.add(new THREE.Mesh(tileGeometry, tileMaterials))
        const iconMaterial = new THREE.MeshBasicMaterial({ transparent: true, toneMapped: false })
        iconMaterial.userData = { path: icon.path }
        iconMaterials.push(iconMaterial)
        const face = new THREE.Mesh(iconGeometry, iconMaterial)
        face.position.z = 0.122
        group.add(face)
        scene.add(group)
        return {
            group,
            weights: Object.fromEntries(formations.map((name) => [name, 0])) as Record<Formation, number>,
            scale: 0,
            pace: 2.2 + 2.6 * (1 - i / (COUNT - 1)),
            arc: 0.25 + hash(i * 5 + 2) * 0.45,
            started: false
        }
    })

    function applyTheme() {
        skyUniforms.uFirst.value.copy(cssColour(token('--scene-sky-1')))
        skyUniforms.uSecond.value.copy(cssColour(token('--scene-sky-2')))
        skyUniforms.uThird.value.copy(cssColour(token('--scene-sky-3')))
        skyUniforms.uFirstLight.value.copy(cssColour(token('--scene-day-1')))
        skyUniforms.uSecondLight.value.copy(cssColour(token('--scene-day-2')))
        skyUniforms.uThirdLight.value.copy(cssColour(token('--scene-day-3')))
        gridUniforms.uLineDark.value.copy(cssColour(token('--scene-line')))
        gridUniforms.uLineLight.value.copy(cssColour(token('--scene-line-day')))
        gridUniforms.uBlue.value.copy(cssColour(token('--scene-blue')))
        dustUniforms.uDark.value.copy(cssColour(token('--scene-dust')))
        dustUniforms.uLight.value.copy(cssColour(token('--scene-blue')))
        sideMaterial.color.copy(cssColour(token('--scene-tile')))
        faceMaterial.map?.dispose()
        faceMaterial.map = canvasTexture((ctx) => {
            const gradient = ctx.createLinearGradient(0, 256, 256, 0)
            gradient.addColorStop(0, token('--scene-face-1') || '#1a4fe0')
            gradient.addColorStop(0.5, token('--scene-blue') || '#3d8bff')
            gradient.addColorStop(0.85, token('--scene-face-2') || '#bcd7ff')
            gradient.addColorStop(1, token('--scene-icon') || '#fff')
            ctx.fillStyle = gradient
            ctx.fillRect(0, 0, 256, 256)
        })
        faceMaterial.needsUpdate = true
        const iconColour = token('--scene-icon')
        iconMaterials.forEach((material) => {
            material.map?.dispose()
            material.map = canvasTexture((ctx) => {
                ctx.scale(256 / 24, 256 / 24)
                ctx.fillStyle = iconColour
                ctx.fill(new Path2D(material.userData.path))
            })
            material.needsUpdate = true
        })
    }
    await pause()
    if (disposed) return
    applyTheme()
    await pause()
    if (disposed) return

    // The scroll timeline: one frame per [data-scene], at the top of the section (its pin
    // spacer when pinned). Between two frames the blend runs over the last screens before the next.
    type Mark = { top: number, frame: Frame, dir: number }
    let marks: Mark[] = [{ top: 0, frame: start, dir: 1 }]
    let measuredHeight = -1
    let measuredAt = 0
    let tall = false
    function measure() {
        measuredHeight = root.scrollHeight
        tall = window.innerHeight > window.innerWidth * 1.15
        const found = [...document.querySelectorAll<HTMLElement>('[data-scene]')].map((element) => {
            const anchor = element.parentElement?.classList.contains('pin-spacer') ? element.parentElement : element
            return { top: anchor.getBoundingClientRect().top + window.scrollY, name: element.dataset.scene || '' }
        }).sort((a, b) => a.top - b.top)
        marks = []
        for (const { top, name } of found) {
            const chosen = frameFor(name, tall)
            const previous = marks[marks.length - 1]
            const turn = previous ? chosen.azim - previous.frame.azim : 0
            marks.push({ top, frame: chosen, dir: Math.abs(turn) > 1 ? Math.sign(turn) : previous ? -previous.dir : 1 })
        }
        if (!marks.length) marks = [{ top: 0, frame: start, dir: 1 }]
    }

    const target = { ...start }
    const state = { ...start }
    const motion = { drift: 0, dir: 1 }
    function sample(y: number) {
        const now = performance.now()
        if (now - measuredAt > 500) {
            measuredAt = now
            if (root.scrollHeight !== measuredHeight) measure()
        }
        const screen = window.innerHeight
        const first = marks[0]
        const last = marks[marks.length - 1]
        if (y <= first.top) {
            Object.assign(target, first.frame)
            motion.drift = 0
            motion.dir = first.dir
            return
        }
        if (y >= last.top) {
            Object.assign(target, last.frame)
            motion.drift = (y - last.top) / screen
            motion.dir = last.dir
            return
        }
        let k = 0
        while (k < marks.length - 2 && marks[k + 1].top <= y) k += 1
        const a = marks[k]
        const b = marks[k + 1]
        const span = Math.min(b.top - a.top, TRANSITION * screen)
        const begin = b.top - span
        const t = ease(clamp((y - begin) / Math.max(1, span), 0, 1))
        for (const key of keys) target[key] = a.frame[key] + (b.frame[key] - a.frame[key]) * t
        motion.drift = ((Math.min(y, begin) - a.top) / screen) * (1 - t)
        motion.dir = a.dir
    }
    measure()
    const onRefresh = () => measure()
    window.addEventListener('chapters:refresh', onRefresh)
    cleanups.push(() => window.removeEventListener('chapters:refresh', onRefresh))

    // The pointer: it nudges the camera, and lights the grid lines beneath it.
    const pointer = { x: 0, y: 0, energy: 0, moved: false }
    const fine = matchMedia('(pointer: fine)').matches
    const onPointer = (event: PointerEvent) => {
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1
        pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
        pointer.energy = 1
        pointer.moved = true
    }
    window.addEventListener('pointermove', onPointer, { passive: true })
    cleanups.push(() => window.removeEventListener('pointermove', onPointer))

    const yAxis = new THREE.Vector3(0, 1, 0)
    const xAxis = new THREE.Vector3(1, 0, 0)
    const qa = new THREE.Quaternion()
    const qb = new THREE.Quaternion()
    const qc = new THREE.Quaternion()
    const lying = new THREE.Quaternion().setFromAxisAngle(xAxis, -Math.PI / 2)
    const lean = new THREE.Vector2()
    const focus = { x: 0.5, y: 0.5, amp: 0 }
    const raycaster = new THREE.Raycaster()
    const aim = new THREE.Vector2()
    const plane = new THREE.Plane()
    const hit = new THREE.Vector3()
    const normal = new THREE.Vector3()
    const lookTarget = new THREE.Vector3()
    let travel = 0
    let dustTravel = 0
    let orbitAngle = 0
    let orbitPace = start.ringPace
    let velocity = 0
    let screens = window.scrollY / window.innerHeight
    let elapsed = 0
    let previous = 0
    let snap = true
    let lightOn = false

    // The sheet's surface at grid coordinates (x, z), lifted by the wave and bent by the curl.
    function surface(x: number, z: number, offset: number, out: THREE.Vector3) {
        const h = Math.sin(elapsed * 0.9 + x * 0.22 + z * 0.18) * 0.45 * state.wave + offset
        const k = (state.curl * Math.PI * 2) / 36
        if (Math.abs(k) < 1e-4) out.set(x, h, z)
        else {
            const a = x * k
            out.set(Math.sin(a) / k - Math.sin(a) * h, (1 - Math.cos(a)) / k + Math.cos(a) * h, z)
        }
        return out.applyMatrix4(sheet.matrixWorld)
    }

    function moveSheet(dt: number) {
        sheet.position.set(state.gX, state.gY, state.gZ)
        qa.setFromAxisAngle(yAxis, state.yaw * degree)
        qb.setFromAxisAngle(xAxis, state.pitch * degree)
        qc.setFromAxisAngle(yAxis, state.spin * degree)
        sheet.quaternion.copy(qa).multiply(qb).multiply(qc)
        sheet.updateMatrixWorld()
        // The grid flows toward the reader, and with the scroll, unless tiles sit on it.
        const seated = Math.min(1, state.settle + state.board + state.stack)
        let next = travel + (state.flow * 0.36 + velocity * 4.5 * (1 - seated)) * dt
        if (state.flow < 0.5 && Math.abs(velocity) < 0.05) next = damp(next, Math.round(next / 3) * 3, 3, dt)
        travel = ((next % 18) + 18) % 18
    }

    function placeCamera(dt: number, kick: number) {
        const width = window.innerWidth
        const height = window.innerHeight
        const portrait = Math.max(0, (1.2 * height) / Math.max(width, 1) - 1)
        const narrow = height > width * 1.15
        // The sway: the camera drifts while a frame holds, and rocks gently with the scroll.
        const e = window.scrollY / height
        const hold = Math.min(motion.drift, 7)
        const sideways = narrow ? 0.55 : 1
        const lift = narrow ? 1.6 : 1
        const swayAzim = (hold * motion.dir * 3.2 + Math.sin(e * 1.05) * 7 + Math.sin(e * 0.43 + 1) * 5) * sideways
        const swayElev = (hold * 0.5 + Math.sin(e * 0.74 + 2) * 3) * lift
        const dolly = (1 - hold * 0.022) * (1 + Math.sin(e * 0.84 + 0.5) * 0.06)
        const rise = Math.sin(e * 0.66) * 0.35 * lift

        lean.x = damp(lean.x, clamp(pointer.x, -1, 1), 2, dt)
        lean.y = damp(lean.y, clamp(pointer.y, -1, 1), 2, dt)
        const breathe = 1 + state.light * 1.6
        const t = elapsed
        const azim = (state.azim + swayAzim + lean.x * 2.5 + Math.sin(t * 0.17) * breathe * 1.4) * degree
        const elev = Math.min(89, state.elev + swayElev + lean.y * 1.5 + Math.sin(t * 0.23) * breathe * 0.8) * degree
        const distance = state.dist * dolly * (1 + portrait * 0.12) + Math.cos(t * 0.13) * breathe * 0.2
        lookTarget.set(state.tgtX, state.tgtY + rise, state.tgtZ)
        camera.position.set(Math.cos(elev) * Math.sin(azim), Math.sin(elev), Math.cos(elev) * Math.cos(azim)).multiplyScalar(distance).add(lookTarget)
        camera.lookAt(lookTarget)
        camera.rotateZ(state.roll * degree)

        // Pan by shifting the film, so the subject moves aside without turning the camera.
        const fov = (2 * Math.atan(Math.tan(((state.fov + kick) * degree) / 2) * (1 + portrait * 0.35))) / degree
        const offset = -(state.pan * Math.max(0, 1 - portrait)) * Math.tan((fov * degree) / 2) * camera.aspect * camera.getFilmWidth()
        const shift = (state.panY * height) / 2
        const current = camera.view?.enabled ? camera.view.offsetY : 0
        if (Math.abs(camera.fov - fov) > 0.01 || Math.abs(camera.filmOffset - offset) > 0.001 || Math.abs(current - shift) > 0.5 || (camera.view?.enabled && camera.view.fullWidth !== width)) {
            camera.fov = fov
            camera.filmOffset = offset
            if (Math.abs(shift) > 0.5) camera.setViewOffset(width, height, 0, shift, width, height)
            else camera.clearViewOffset()
            camera.updateProjectionMatrix()
        }
    }

    function focusGrid(dt: number) {
        pointer.energy *= Math.exp(-dt * 0.8)
        camera.updateMatrixWorld()
        raycaster.setFromCamera(aim.set(pointer.x, pointer.y), camera)
        plane.setFromNormalAndCoplanarPoint(normal.set(0, 1, 0).applyQuaternion(sheet.quaternion), sheet.position)
        const landed = raycaster.ray.intersectPlane(plane, hit) !== null
        if (landed) {
            sheet.worldToLocal(hit)
            const x = Math.floor(hit.x / CELL) + 0.5
            const y = Math.floor(-hit.z / CELL + travel / CELL) + 0.5
            const jump = Math.abs(x - focus.x) > 3 || Math.abs(y - focus.y) > 3
            focus.x = jump ? x : damp(focus.x, x, 16, dt)
            focus.y = jump ? y : damp(focus.y, y, 16, dt)
        }
        const active = landed && fine && pointer.moved && pointer.energy > 0.05
        focus.amp = damp(focus.amp, active ? state.grid : 0, 6, dt)
    }

    // Where tile i stands in each formation.
    const centre = new THREE.Vector3()
    const ring = new THREE.Vector3()
    const tilt = new THREE.Quaternion()
    const facing = new THREE.Quaternion()
    const dummy = new THREE.Object3D()
    const eye = new THREE.Vector3()
    const forward = new THREE.Vector3()
    const origin = new THREE.Vector3()
    const across = new THREE.Vector3()
    const upward = new THREE.Vector3()
    const euler = new THREE.Euler()
    const spot = { p: new THREE.Vector3(), q: new THREE.Quaternion(), scale: 1, show: 1 }
    const seats = [[-4, -3], [-1, -4], [2, -3], [4, -1], [-3, 0], [0, -1], [3, 2], [-5, 2], [1, 2], [-2, 4], [4, 4], [-1, 1]]

    function onSheet(x: number, z: number, offset: number) {
        surface(x, z, offset, spot.p)
        spot.q.copy(sheet.quaternion).multiply(lying)
    }

    function place(name: Formation, i: number, t: number) {
        const r = (k: number) => hash(i * 11 + k)
        spot.scale = 1
        spot.show = 1
        centre.set(state.tgtX, state.tgtY, state.tgtZ)
        switch (name) {
            case 'orbit': {
                centre.y += state.ringY
                const angle = (i / COUNT) * Math.PI * 2 + orbitAngle
                tilt.setFromAxisAngle(xAxis, state.ringTilt * degree)
                ring.set(Math.cos(angle) * state.ring, Math.sin(t * 0.7 + i * 1.3) * 0.2, Math.sin(angle) * state.ring * state.ringDepth)
                spot.p.copy(ring.applyQuaternion(tilt)).add(centre)
                dummy.position.copy(spot.p)
                dummy.lookAt(eye)
                facing.copy(dummy.quaternion)
                dummy.lookAt(centre)
                dummy.rotateY(Math.PI)
                spot.q.copy(dummy.quaternion).slerp(facing, state.ringFace)
                // Tiles passing in front of the text shrink away.
                const turning = smooth(0, 0.08, state.ringFace) * smooth(0, 0.08, 1 - state.ringFace)
                const front = state.ringFront * smooth(-0.35, 0.1, -Math.sin(angle))
                spot.scale = state.ringScale * (1 - turning * smooth(0.9, 1, -Math.sin(angle))) * (1 - front)
                break
            }
            case 'drift':
                spot.p.set(
                    centre.x + (r(1) - 0.5) * 13 + Math.sin(t * 0.17 + i) * 0.5,
                    centre.y + (r(2) - 0.35) * 5.5 + Math.sin(t * 0.23 + i * 2.1) * 0.35,
                    centre.z + (r(3) - 0.5) * 11 + Math.cos(t * 0.14 + i * 2.7) * 0.5
                )
                spot.q.setFromEuler(euler.set((r(4) - 0.5) * 0.7 + Math.sin(t * 0.15 + i) * 0.15, (r(5) - 0.5) + Math.sin(t * 0.12 + i * 1.7) * 0.2, Math.sin(t * 0.13 + i * 1.3) * 0.15))
                spot.scale = 0.8 + r(6) * 0.45
                break
            case 'settle': {
                const [x, z] = seats[i % seats.length]
                onSheet((x + 0.5) * CELL, (z + 0.5) * CELL, 0.15)
                break
            }
            case 'board':
                onSheet(((i % 4) - 1.5) * CELL, (Math.floor(i / 4) - 1.5) * CELL, 0.15)
                break
            case 'stack': {
                const level = Math.floor(i / 4)
                const along = ((i % 4) - 1.5) * CELL
                onSheet(level === 1 ? CELL / 2 : along, level === 0 ? CELL / 2 : level === 1 ? along : -CELL / 2, 0.15 + (level - 1) * LAYER_GAP * state.layers)
                break
            }
            case 'row': {
                const side = i % 2
                const z = ((Math.floor(i / 2) * 3 + side * CELL + travel) % 18) - 9 + CELL / 2
                onSheet(side === 0 ? -CELL / 2 : CELL / 2, z, 0.15)
                spot.show = 1 - smooth(6, 9, Math.abs(z))
                break
            }
            case 'stream': {
                const e = ((t * 2.2 + (i / COUNT) * 30) % 30) / 30
                const radius = 2.2 + r(7) * 1.8
                const angle = i * 2.39996 + t * 0.08
                const azim = state.azim * degree
                const elev = state.elev * degree
                forward.set(-Math.cos(elev) * Math.sin(azim), -Math.sin(elev), -Math.cos(elev) * Math.cos(azim))
                origin.set(state.tgtX, state.tgtY, state.tgtZ).addScaledVector(forward, -state.dist)
                across.crossVectors(forward, yAxis).normalize()
                upward.crossVectors(across, forward)
                spot.p.copy(origin).addScaledVector(forward, 3 + e * 30).addScaledVector(across, Math.cos(angle) * radius).addScaledVector(upward, Math.sin(angle) * radius)
                dummy.position.copy(spot.p)
                dummy.lookAt(origin)
                dummy.rotateZ(angle * 0.3)
                spot.q.copy(dummy.quaternion)
                spot.scale = 1.1
                spot.show = smooth(0, 0.12, e) * (1 - smooth(0.75, 1, e))
                break
            }
        }
    }

    const sum = new THREE.Vector3()
    const blend = new THREE.Quaternion()
    function moveTiles(dt: number, instant: boolean) {
        eye.copy(camera.position)
        eye.y -= 5
        orbitPace = instant ? state.ringPace : damp(orbitPace, state.ringPace, 1.8, dt)
        orbitAngle = (orbitAngle + orbitPace * dt) % (Math.PI * 2)
        tiles.forEach((tile, i) => {
            sum.set(0, 0, 0)
            let weight = 0
            let total = 0
            let size = 0
            let moving = 0
            for (const name of formations) {
                const goal = state[name]
                const w = tile.weights[name] = tile.started && !instant ? damp(tile.weights[name], goal, tile.pace, dt) : goal
                moving += Math.abs(goal - w)
                if (w < 1e-4) continue
                place(name, i, elapsed)
                const share = w * Math.max(spot.show, 0.001)
                sum.addScaledVector(spot.p, share)
                if (weight === 0) blend.copy(spot.q)
                else blend.slerp(spot.q, share / (weight + share))
                weight += share
                total += w
                size += w * spot.scale * spot.show
            }
            tile.started = true
            if (weight > 0) sum.divideScalar(weight)
            // Tiles hop as they move between formations.
            sum.y += Math.min(1, moving) * tile.arc
            const goalScale = total > 0 ? size / total : 0
            tile.scale = instant ? goalScale : damp(tile.scale, goalScale, 3, dt)
            tile.group.position.copy(sum)
            tile.group.quaternion.copy(blend)
            tile.group.scale.setScalar(Math.max(tile.scale, 0.001))
            tile.group.visible = tile.scale > 0.01
        })
    }

    function render(time: number) {
        if (!renderer) return
        const still = reduced || paused.value
        const dt = previous ? Math.min((time - previous) / 1000, 0.05) : 0
        previous = time
        if (!still) elapsed += dt
        const instant = snap || still

        sample(window.scrollY)
        if (instant) Object.assign(state, target)
        else for (const key of keys) state[key] = damp(state[key], target[key], 3.2, dt)

        const now = window.scrollY / window.innerHeight
        const raw = dt > 0 ? (now - screens) / dt : 0
        velocity = instant ? 0 : damp(velocity, clamp(raw, -4, 4), 6, dt)
        screens = now

        moveSheet(dt)
        placeCamera(dt, still ? 0 : Math.min(Math.abs(velocity), 3) * 0.8)
        if (!still) focusGrid(dt)

        sky.position.copy(camera.position)
        skyUniforms.uTime.value = elapsed * 0.04
        skyUniforms.uLight.value = state.light
        skyUniforms.uPhase.value = state.sky

        gridGroup.position.copy(sheet.position)
        gridGroup.quaternion.copy(sheet.quaternion)
        gridUniforms.uTime.value = elapsed
        gridUniforms.uWave.value = state.wave
        gridUniforms.uCurl.value = state.curl
        gridUniforms.uExtent.value = state.extent
        gridUniforms.uFocus.value.set(focus.x, focus.y)
        gridUniforms.uFocusAmp.value = focus.amp
        gridUniforms.uLight.value = state.light
        gridUniforms.uFlow.value = travel / CELL
        levels.forEach((level, n) => {
            const outer = level !== 0
            gridMeshes[n].position.y = level * LAYER_GAP * state.layers
            gridMeshes[n].visible = !outer || state.layers > 0.01
            gridMaterials[n].uniforms.uOpacity.value = state.grid * (outer ? state.layers * 0.8 : 1)
        })

        dustTravel += (state.rush * 2.2 + velocity * 6.5) * dt
        dustUniforms.uTime.value = elapsed
        dustUniforms.uProj.value = (window.innerHeight * renderer.getPixelRatio()) / (2 * Math.tan((camera.fov * degree) / 2))
        dustUniforms.uTravel.value = dustTravel
        dustUniforms.uCenter.value.copy(camera.position)
        dustUniforms.uLightMix.value = state.light
        dustUniforms.uOpacity.value = state.dust * (1 - state.light * 0.45)

        moveTiles(dt, instant)

        // The page follows the sky: day chapters set their type dark once the sky has mostly turned (the sky shader eases its light value).
        const light = state.light > 0.35
        if (light !== lightOn) {
            lightOn = light
            root.classList.toggle('is-light', light)
            window.dispatchEvent(new CustomEvent('world:light', { detail: light }))
        }

        renderer.render(scene, camera)
        snap = false
    }

    function resize() {
        if (!renderer) return
        renderer.setSize(window.innerWidth, window.innerHeight, false)
        camera.aspect = window.innerWidth / window.innerHeight
        camera.clearViewOffset()
        camera.updateProjectionMatrix()
        measure()
        render(performance.now())
    }

    // A chapter jump lands without the world gliding across the page.
    const onJump = () => { snap = true }
    window.addEventListener('motion:jump', onJump)
    cleanups.push(() => window.removeEventListener('motion:jump', onJump))

    let running = false
    function loop(time: number) {
        frame = requestAnimationFrame(loop)
        render(time)
    }
    function sync() {
        const run = !reduced && !paused.value && document.visibilityState === 'visible'
        if (run && !running) { running = true; previous = 0; frame = requestAnimationFrame(loop) }
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

    // Compile every shader before the first frame, off the main thread where the browser allows it.
    await renderer.compileAsync(scene, camera).catch(() => undefined)
    if (disposed || !canvas.value) return
    resize()
    sync()
    canvas.value.classList.add('is-ready')
    // The page drops its own sheet colours once the world paints them.
    root.classList.add('has-world')

    cleanups.push(() => {
        root.classList.remove('has-world', 'is-light');
        [skyGeometry, gridGeometry, dustGeometry, tileGeometry, iconGeometry].forEach((g) => g.dispose());
        [skyMaterial, ...gridMaterials, dustMaterial, sideMaterial, faceMaterial].forEach((m) => m.dispose())
        faceMaterial.map?.dispose()
        iconMaterials.forEach((material) => { material.map?.dispose(); material.dispose() })
        scene.environment?.dispose()
    })
})

onBeforeUnmount(() => {
    disposed = true
    cancelAnimationFrame(frame)
    cleanups.forEach((cleanup) => cleanup())
    renderer?.dispose()
})
</script>

<template>
    <canvas ref="canvas" class="world" aria-hidden="true"></canvas>
</template>

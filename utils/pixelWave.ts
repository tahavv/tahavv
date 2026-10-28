// The jump between chapters, after the reference: a wave of 12px squares spreads from
// the click and covers the screen, the page moves underneath, then the wave clears.
// Each square grows from a third of its cell, flashing blue while it turns.
const CELL = 12
const SPREAD = 0.5
const TURN = 0.34

type Wave = { width: number, height: number, cols: number, order: Float32Array }
type Rgb = [number, number, number]

const easeOut = (x: number) => 1 - (1 - x) ** 3
const clamp = (x: number) => Math.min(1, Math.max(0, x))

function plan(width: number, height: number, from: { x: number, y: number }): Wave {
    const cols = Math.ceil(width / CELL)
    const rows = Math.ceil(height / CELL)
    const ox = from.x / CELL
    const oy = from.y / CELL
    const reach = Math.hypot(Math.max(ox, cols - ox), Math.max(oy, rows - oy))
    const order = new Float32Array(cols * rows)
    for (let i = 0; i < order.length; i += 1) {
        const x = i % cols
        const y = Math.floor(i / cols)
        order[i] = Math.min(1, 0.85 * (Math.hypot(x + 0.5 - ox, y + 0.5 - oy) / reach) + 0.15 * Math.random())
    }
    return { width, height, cols, order }
}

// Draws one frame; returns true while any square is still turning.
function paint(ctx: CanvasRenderingContext2D, wave: Wave, time: number, covering: boolean, base: Rgb, flash: Rgb) {
    ctx.clearRect(0, 0, wave.width, wave.height)
    let busy = false
    for (let i = 0; i < wave.order.length; i += 1) {
        const c = clamp((time - wave.order[i] * SPREAD) / TURN)
        if (c < 1) busy = true
        const fill = covering ? easeOut(c) : 1 - easeOut(c)
        if (fill <= 0.01) continue
        const heat = c > 0 && c < 1 ? Math.max(0, 1 - Math.abs(c - 0.3) / 0.3) * 0.55 : 0
        const size = CELL * (0.35 + 0.65 * fill)
        const x = (i % wave.cols) * CELL + (CELL - size) / 2
        const y = Math.floor(i / wave.cols) * CELL + (CELL - size) / 2
        const r = base[0] + (flash[0] - base[0]) * heat
        const g = base[1] + (flash[1] - base[1]) * heat
        const b = base[2] + (flash[2] - base[2]) * heat
        ctx.fillStyle = `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${Math.min(1, fill * 1.15).toFixed(3)})`
        ctx.fillRect(x, y, size + 0.5, size + 0.5)
    }
    return busy
}

function play(ctx: CanvasRenderingContext2D, wave: Wave, covering: boolean, base: Rgb, flash: Rgb) {
    return new Promise<void>((resolve) => {
        const start = performance.now()
        const step = (now: number) => {
            const time = (now - start) / 1000
            if (paint(ctx, wave, time, covering, base, flash) && time <= 0.94) requestAnimationFrame(step)
            else resolve()
        }
        requestAnimationFrame(step)
    })
}

// Any CSS colour (tokens are oklch) as RGB, by painting one pixel.
function rgb(value: string): Rgb {
    const surface = document.createElement('canvas')
    surface.width = surface.height = 1
    const ctx = surface.getContext('2d', { willReadFrequently: true })!
    ctx.fillStyle = value
    ctx.fillRect(0, 0, 1, 1)
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
    return [r, g, b]
}

let running = false

export async function pixelWave(move: () => void, from?: { x: number, y: number }) {
    if (running) return
    running = true
    const width = window.innerWidth
    const height = window.innerHeight
    const canvas = document.createElement('canvas')
    canvas.className = 'pixel-jump'
    canvas.setAttribute('aria-hidden', 'true')
    const ratio = Math.min(2, window.devicePixelRatio || 1)
    canvas.width = Math.round(width * ratio)
    canvas.height = Math.round(height * ratio)
    const ctx = canvas.getContext('2d')
    if (!ctx) {
        running = false
        move()
        return
    }
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    const block = (event: Event) => event.preventDefault()
    canvas.addEventListener('wheel', block, { passive: false })
    canvas.addEventListener('touchmove', block, { passive: false })
    document.body.appendChild(canvas)
    const styles = getComputedStyle(document.documentElement)
    const base = rgb(styles.getPropertyValue('--color-paper-2'))
    const flash = rgb(styles.getPropertyValue('--color-accent-2'))
    const wave = plan(width, height, from ?? { x: width / 2, y: height / 2 })
    try {
        await play(ctx, wave, true, base, flash)
        move()
        await new Promise((resolve) => requestAnimationFrame(resolve))
        await play(ctx, wave, false, base, flash)
    } finally {
        canvas.remove()
        running = false
    }
}

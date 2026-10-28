// Camera, grid and tile settings for each chapter of the 3D world, after the reference.
// A section names its frame in data-scene; the world reaches that frame when the section's
// top meets the top of the screen, and eases toward it over the screens before.
export type Frame = typeof base

const base = {
    tgtX: 0, tgtY: 1.5, tgtZ: -3, azim: 0, elev: 6, dist: 12, roll: 0, fov: 40, pan: 0, panY: 0,
    light: 0, sky: 0, gX: 0, gY: -1, gZ: -6, pitch: 0, yaw: 0, spin: 0, curl: 0, wave: 0.6, flow: 0,
    grid: 1, layers: 0, extent: 1, dust: 0.3, rush: 0,
    ring: 3.4, ringY: 0, ringTilt: 22, ringDepth: 0.62, ringScale: 1, ringFace: 0, ringFront: 0, ringPace: 0.07,
    orbit: 0, drift: 0, settle: 0, board: 0, stream: 0, stack: 0, row: 0
}

export const formations = ['orbit', 'drift', 'settle', 'board', 'stream', 'stack', 'row'] as const
export type Formation = typeof formations[number]

const frame = (values: Partial<Frame>): Frame => ({ ...base, ...values })

const desktop: Record<string, Frame> = {
    // The opening: a wide ring of tiles to the right of the head, a waving ramp of grid beneath.
    ramp: frame({ tgtX: 2.4, tgtY: 1.2, tgtZ: -3, azim: 14, elev: 5, dist: 13, pan: 0.34, panY: 0.3, sky: 0.55, gX: 2, gY: -2, gZ: -9, pitch: 52, yaw: -16, wave: 0.8, flow: 3, orbit: 1, ring: 5.2, ringY: 0.9, ringTilt: 6, ringDepth: 1, ringScale: 1.6, ringFront: 1, ringPace: 0.14 }),
    // A halo of tiles facing the reader around a centred statement.
    halo: frame({ tgtX: 0, tgtY: 1.6, tgtZ: 0, azim: 6, elev: 4, dist: 11, roll: -2, fov: 42, sky: -0.6, gX: 0, gY: 1.6, gZ: -7, pitch: 90, spin: 18, wave: 1.1, flow: 2, grid: 0, dust: 1, orbit: 1, ring: 4.4, ringTilt: 84, ringFace: 1 }),
    plan: frame({ tgtX: 0, tgtY: -2, tgtZ: -2, azim: 12, elev: 58, dist: 14, sky: -1.6, gX: 0, gY: -2, gZ: -2, wave: 0.4, settle: 1 }),
    field: frame({ tgtX: 0, tgtY: 1.6, tgtZ: -3, azim: -14, elev: 40, dist: 13, sky: -0.9, gX: 0, gY: -2, gZ: -3, wave: 0.35, dust: 0.4, settle: 1 }),
    // The field with no tiles: for short chapters of figures, where tiles would only cross the type.
    open: frame({ tgtX: 0, tgtY: 1.6, tgtZ: -3, azim: -14, elev: 40, dist: 13, sky: -0.9, gX: 0, gY: -2, gZ: -3, wave: 0.35, flow: 1, dust: 0.6 }),
    // The day sheet: the sky goes pale through blue, the tiles lie on the floor.
    white: frame({ tgtX: 0, tgtY: 2.4, tgtZ: -3, azim: -16, elev: 22, dist: 14, light: 1, sky: -1.6, gX: 0, gY: -1.5, gZ: -3, wave: 0.5, dust: 0.15, settle: 1 }),
    // Still day, the sheet curled up into a valley that flows toward the reader.
    valley: frame({ tgtX: 1.5, tgtY: 1.4, tgtZ: -8, azim: 10, elev: 5, dist: 10, fov: 42, pan: 0.3, light: 1, sky: -1.6, gX: 0, gY: -1.4, gZ: -8, curl: 0.24, wave: 0.7, flow: 5, dust: 0.15, settle: 1 }),
    board: frame({ tgtX: 1.5, tgtY: 2.15, tgtZ: -7, azim: 8, elev: 7, dist: 12.5, pan: 0.32, light: 1, sky: -1.6, gX: 1.5, gY: 1.4, gZ: -7, pitch: 90, yaw: -20, wave: 0.35, dust: 0.15, board: 1 }),
    // Three small sheets stacked, tiles on each, turning slowly.
    layers: frame({ tgtX: 0, tgtY: 0.4, tgtZ: -5, azim: 26, elev: 30, dist: 15, sky: 0.2, gX: 0, gY: -1.2, gZ: -5, spin: 45, wave: 0.3, layers: 1, extent: 0.24, stack: 1 }),
    conveyor: frame({ tgtX: 0, tgtY: 1.2, tgtZ: -6, azim: 48, elev: 20, dist: 12.5, sky: -0.8, gX: 0, gY: -1, gZ: -7, pitch: 58, yaw: 32, wave: 0.4, flow: 3, row: 1 }),
    horizon: frame({ tgtX: 2.6, tgtY: 1.8, tgtZ: -4, azim: -6, elev: 3, dist: 12, fov: 44, pan: 0.4, sky: 0.35, gX: 3, gY: 0.5, gZ: -12, pitch: 82, yaw: 14, spin: -10, wave: 1, flow: 2, dust: 0.6, orbit: 1, ring: 3.9, ringTilt: 30, ringDepth: 1, ringScale: 0.68 }),
    // The way out: tiles stream past toward the reader through the dust.
    ship: frame({ tgtX: 0, tgtY: 1, tgtZ: -30, azim: 4, elev: 2, dist: 30, fov: 44, pan: 0.22, sky: 0.2, gX: 0, gY: -2, gZ: -10, wave: 0.4, grid: 0, dust: 1, rush: 1, stream: 1 })
}

// Portrait screens keep the subject centred and lift it above the text.
const portrait: Record<string, Partial<Frame>> = {
    ramp: { pan: 0, panY: 0.66, ring: 6.6, ringY: 1.1, ringScale: 2.5 },
    halo: { pan: 0, panY: 0.55, roll: 0, ring: 2.4, ringTilt: 18, ringY: 0.4 },
    plan: { pan: 0 },
    field: { pan: 0 },
    open: { pan: 0 },
    white: { pan: 0, panY: -0.3 },
    valley: { pan: 0, panY: 0.5 },
    board: { pan: 0, panY: 0.55, dist: 14 },
    layers: { pan: 0, panY: -0.8 },
    conveyor: { pan: 0, panY: 0.7, azim: -28, elev: 30, dist: 15 },
    horizon: { pan: 0, panY: -0.4, ring: 5.8, ringTilt: 6, ringScale: 2, ringFront: 1, ringPace: 0.14, sky: -0.45 },
    ship: { pan: 0, panY: 0.45 }
}

export const start: Frame = { ...base }

export function frameFor(name: string, tall: boolean): Frame {
    const chosen = desktop[name] ?? desktop.field
    return tall ? { ...chosen, ...portrait[name] } : chosen
}

export const keys = Object.keys(base) as (keyof Frame)[]

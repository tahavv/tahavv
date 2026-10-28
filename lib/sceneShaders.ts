// Shaders for the 3D world, after the reference.

// The sky: the inside of a sphere around the camera, banded by one noise-twisted wave.
export const skyVertex = /* glsl */ `
    varying vec3 vPosition;
    void main() {
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`

export const skyFragment = /* glsl */ `
    uniform float uTime;
    uniform float uLight;
    uniform float uPhase;
    uniform vec3 uFirst;
    uniform vec3 uSecond;
    uniform vec3 uThird;
    uniform vec3 uFirstLight;
    uniform vec3 uSecondLight;
    uniform vec3 uThirdLight;
    varying vec3 vPosition;

    float mod289(float x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 perm(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }

    float noise(vec3 p) {
        vec3 a = floor(p);
        vec3 d = p - a;
        d = d * d * (3.0 - 2.0 * d);
        vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
        vec4 k1 = perm(b.xyxy);
        vec4 k2 = perm(k1.xyxy + b.zzww);
        vec4 c = k2 + a.zzzz;
        vec4 k3 = perm(c);
        vec4 k4 = perm(c + 1.0);
        vec4 o1 = fract(k3 * (1.0 / 41.0));
        vec4 o2 = fract(k4 * (1.0 / 41.0));
        vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
        vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);
        return o4.y * d.y + o4.x * (1.0 - d.y);
    }

    mat2 rotate2D(float a) {
        return mat2(cos(a), -sin(a), sin(a), cos(a));
    }

    void main() {
        vec3 p = vPosition * 0.03;
        float n = noise(p + uTime);
        vec2 uv = rotate2D(n) * p.xy * 0.05;

        // Between night and day the sky passes through blue instead of a flat grey.
        float l = smoothstep(0.15, 0.85, uLight);
        float via = sin(3.14159 * l) * 0.5;
        vec3 first = mix(uFirst, uFirstLight, l);
        vec3 second = mix(uSecond, uSecondLight, l);
        vec3 third = mix(mix(uThird, uThirdLight, l), uFirst, via);

        // The bands: night for most of the sky, then blue, then a soft light edge.
        float s = 0.5 + 0.5 * sin(uv.x * 25.0 + uPhase);
        vec3 col = mix(third, first, smoothstep(0.42, 0.78, s));
        col = mix(col, second, smoothstep(0.8, 0.99, s));

        gl_FragColor = vec4(col, 1.0);
        #include <colorspace_fragment>
    }
`

// The grid: a sheet that waves and can curl into a valley; hairlines, a plus every other
// crossing, a soft fade at its edge, and blue lines around the pointer.
export const gridVertex = /* glsl */ `
    uniform float uTime;
    uniform float uWave;
    uniform float uCurl;
    uniform float uSize;
    varying vec2 vUv;

    void main() {
        vUv = uv;
        vec3 p = position;
        float h = sin(uTime * 0.9 + p.x * 0.22 + p.z * 0.18) * 0.45 * uWave;
        vec3 q = vec3(p.x, h, p.z);
        float k = uCurl * 6.2831853 / uSize;
        if (abs(k) > 1e-4) {
            float a = p.x * k;
            q = vec3(sin(a) / k - sin(a) * h, (1.0 - cos(a)) / k + cos(a) * h, p.z);
        }
        gl_Position = projectionMatrix * modelViewMatrix * vec4(q, 1.0);
    }
`

export const gridFragment = /* glsl */ `
    uniform vec3 uLineDark;
    uniform vec3 uLineLight;
    uniform float uLight;
    uniform float uOpacity;
    uniform float uFlow;
    uniform float uCells;
    uniform float uCurl;
    uniform float uExtent;
    uniform vec2 uFocus;
    uniform float uFocusAmp;
    uniform vec3 uBlue;
    varying vec2 vUv;

    float sdPlus(vec2 p, float size, float thickness) {
        vec2 d = abs(p) - vec2(size, thickness);
        float h = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
        d = abs(p) - vec2(thickness, size);
        float v = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
        return min(h, v);
    }

    float grid(vec2 g) {
        vec2 f = fract(g);
        vec2 w = max(abs(dFdx(g)), abs(dFdy(g))) * 1.1;
        vec2 lines = abs(f - 0.5);
        vec2 aa = smoothstep(0.5 - w, 0.5 - w * 0.5, lines);
        return max(aa.x, aa.y);
    }

    void main() {
        vec2 g = (vUv - 0.5) * uCells;
        g.y += uFlow;

        float lineMask = grid(g);
        vec2 cell = floor(g / 2.0 + 0.5) * 2.0;
        float plus = 1.0 - smoothstep(0.0, max(fwidth(g.x), 0.01) * 1.2, sdPlus(g - cell, 0.2, 0.02));

        // A round fade on a full sheet, a crisper rounded square on a small one; a curled sheet fades at its ends.
        vec2 d = (vUv - 0.5) * 2.0;
        d.x *= 1.0 - clamp(uCurl, 0.0, 1.0) * 0.92;
        vec2 d4 = d * d * d * d;
        float r = mix(length(d), pow(d4.x + d4.y, 0.25), 1.0 - uExtent);
        float inner = uExtent * (0.3 + (1.0 - uExtent) * 0.7);
        float fade = 1.0 - smoothstep(inner, uExtent, r);

        vec3 color = mix(uLineDark, uLineLight, uLight);
        float lineAlpha = mix(0.4, 0.14, uLight);
        float plusAlpha = mix(0.9, 0.55, uLight);
        float a = max(lineMask * lineAlpha, plus * plusAlpha);

        // Around the pointer the lines take the blue, then fade back to the grid.
        float near = (1.0 - smoothstep(0.7, 3.0, length(g - uFocus))) * uFocusAmp;
        color = mix(color, uBlue, near);
        a = max(a, lineMask * near * 0.7);

        gl_FragColor = vec4(color, a * fade * uOpacity);
        #include <colorspace_fragment>
    }
`

// The dust: points in a box that wraps around the camera, so the field never runs out.
export const dustVertex = /* glsl */ `
    attribute float aSeed;
    uniform float uTime;
    uniform float uProj;
    uniform float uSize;
    uniform float uTravel;
    uniform vec3 uCenter;
    uniform vec3 uBox;
    varying float vAlpha;

    void main() {
        vec3 p = position;
        p.y += uTime * (0.04 + aSeed * 0.06);
        p.x += sin(uTime * 0.1 + aSeed * 30.0) * 0.5;
        p.z += uTravel;
        vec3 d = mod(p - uCenter + uBox, 2.0 * uBox) - uBox;
        vec4 mv = modelViewMatrix * vec4(uCenter + d, 1.0);
        float depth = -mv.z;
        vec3 e = abs(d) / uBox;
        float edge = 1.0 - smoothstep(0.6, 1.0, max(e.x, max(e.y, e.z)));
        vAlpha = edge * smoothstep(1.0, 3.5, depth) * (0.6 + 0.4 * sin(uTime * 0.8 + aSeed * 40.0));
        gl_PointSize = min(uSize * (0.5 + aSeed) * uProj / max(depth, 0.1), 90.0);
        gl_Position = projectionMatrix * mv;
    }
`

export const dustFragment = /* glsl */ `
    uniform vec3 uDark;
    uniform vec3 uLight;
    uniform float uLightMix;
    uniform float uOpacity;
    varying float vAlpha;

    void main() {
        float a = smoothstep(0.5, 0.12, length(gl_PointCoord - 0.5)) * vAlpha * uOpacity;
        if (a < 0.004) discard;
        gl_FragColor = vec4(mix(uDark, uLight, uLightMix), a);
        #include <colorspace_fragment>
    }
`

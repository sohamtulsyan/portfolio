"use client";

/**
 * Route transition built on SmoothUI's "Zoom Wash" shader
 * (shader-reveal-zoom-transition, github.com/educlopez/smoothui).
 *
 * Differences from the library component, needed for page-level use:
 * - The canvas is a fixed full-viewport overlay instead of wrapping children.
 * - It intercepts internal link clicks, plays to the shader midpoint, navigates,
 *   holds the wash until the new route has rendered, then plays out.
 * - Colours come from the theme (--transition-color-1/2) as uniforms.
 * - The render loop only runs while a transition is playing.
 */

import { useReducedMotion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { readColorToken, toRgbFloats } from "@/lib/theme-tokens";

const DURATION_MS = 1080;
const MAX_HOLD_MS = 2500;
const MAX_DPR = 2;

const VERTEX_SHADER = "attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }";
const FRAGMENT_SHADER = `
precision mediump float;
uniform vec2 uRes;
uniform float uProgress;
uniform float uAlpha;
uniform vec3 uColorA;
uniform vec3 uColorB;

float parabola(float x, float k){ return pow(4.0 * x * (1.0 - x), k); }

vec4 paint(vec2 uv, float mask, vec3 color, float glow){
  float exitFade = smoothstep(1.0, 0.76, uProgress);
  float entryFade = smoothstep(0.0, 0.10, uProgress);
  float alpha = clamp((mask * 0.76 + glow * 0.24) * entryFade * exitFade * uAlpha, 0.0, 0.92);
  return vec4(color * alpha + vec3(1.0) * glow * 0.16 * uAlpha, alpha);
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 aspect = vec2(uRes.x / uRes.y, 1.0);
  float progress = smoothstep(0.0, 1.0, uProgress);

  // Zoom mix: a large central lens with a travelling seam.
  float yGate = smoothstep(0.0, 1.0, progress * 2.15 + uv.y - 1.08);
  vec2 z = (uv - 0.5) * mix(1.75, 0.35, yGate) + 0.5;
  float lens = 1.0 - smoothstep(0.12, 0.78, length((z - 0.5) * aspect));
  float seam = exp(-pow(yGate - 0.5, 2.0) * 20.0);
  float mask = (lens * 0.72 + seam * 0.42) * parabola(progress, 0.42);
  float glow = seam * 0.9 + lens * 0.25;
  vec3 color = mix(uColorA, uColorB, yGate);

  gl_FragColor = paint(uv, mask, color, glow);
}
`;
const STRIP = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const easeOutQuart = (v: number) => 1 - (1 - v) ** 4;

interface Controller {
  draw: (progress: number, alpha: number) => void;
  destroy: () => void;
}

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createController(canvas: HTMLCanvasElement): Controller | null {
  const gl = canvas.getContext("webgl", { alpha: true, antialias: false, premultipliedAlpha: true });
  if (!gl) return null;
  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  const program = gl.createProgram();
  if (!(vertex && fragment && program)) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, STRIP, gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "a");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  const uRes = gl.getUniformLocation(program, "uRes");
  const uProgress = gl.getUniformLocation(program, "uProgress");
  const uAlpha = gl.getUniformLocation(program, "uAlpha");
  const uColorA = gl.getUniformLocation(program, "uColorA");
  const uColorB = gl.getUniformLocation(program, "uColorB");
  gl.uniform3fv(uColorA, toRgbFloats(readColorToken("--transition-color-1")));
  gl.uniform3fv(uColorB, toRgbFloats(readColorToken("--transition-color-2")));

  return {
    draw(progress, alpha) {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const width = Math.max(1, Math.round(rect.width * dpr));
      const height = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, width, height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uRes, width, height);
      gl.uniform1f(uProgress, clamp01(progress));
      gl.uniform1f(uAlpha, clamp01(alpha));
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
    destroy() {
      gl.clear(gl.COLOR_BUFFER_BIT);
      if (buffer) gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    },
  };
}

function normalize(path: string) {
  return path.length > 1 ? path.replace(/\/+$/, "") : path;
}

export default function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controllerRef = useRef<Controller | null>(null);
  const state = useRef({
    active: false,
    holding: false,
    arrived: false,
    elapsedAtHold: 0,
    startedAt: 0,
    holdStartedAt: 0,
    frame: 0,
    target: "",
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    controllerRef.current = createController(canvas);
    const s = state.current;
    return () => {
      cancelAnimationFrame(s.frame);
      controllerRef.current?.destroy();
      controllerRef.current = null;
    };
  }, []);

  // Route committed: release the hold so the wash plays out over the new page.
  useEffect(() => {
    state.current.arrived = true;
  }, [pathname]);

  useEffect(() => {
    const finish = () => {
      const s = state.current;
      s.active = false;
      s.holding = false;
      document.documentElement.removeAttribute("data-transitioning");
      controllerRef.current?.draw(0, 0);
      if (canvasRef.current) canvasRef.current.style.opacity = "0";
    };

    const loop = () => {
      const s = state.current;
      const controller = controllerRef.current;
      if (!s.active || !controller) return;
      const now = performance.now();

      if (s.holding) {
        // Wait at the midpoint until the new route has rendered (or give up).
        if (s.arrived || now - s.holdStartedAt > MAX_HOLD_MS) {
          s.holding = false;
          s.startedAt = now - s.elapsedAtHold;
          document.documentElement.removeAttribute("data-transitioning");
        }
        controller.draw(0.5, 1);
        s.frame = requestAnimationFrame(loop);
        return;
      }

      const raw = clamp01((now - s.startedAt) / DURATION_MS);
      const progress = easeOutQuart(raw);

      if (progress >= 0.5 && s.target) {
        const href = s.target;
        s.target = "";
        s.holding = true;
        s.arrived = false;
        s.holdStartedAt = now;
        s.elapsedAtHold = now - s.startedAt;
        router.push(href);
      }

      controller.draw(progress, raw < 1 ? 1 : 0);
      if (raw < 1) {
        s.frame = requestAnimationFrame(loop);
      } else {
        finish();
      }
    };

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor || anchor.hasAttribute("download") || anchor.dataset.noTransition !== undefined) return;
      const target = anchor.getAttribute("target");
      if (target && target !== "_self") return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (normalize(url.pathname) === normalize(window.location.pathname)) return;
      if (/\.(pdf|jpg|jpeg|png|webp|zip|txt|xml)$/i.test(url.pathname)) return;
      if (reduceMotion || !controllerRef.current) return; // let next/link handle it

      event.preventDefault();
      const s = state.current;
      if (s.active) return;
      s.active = true;
      s.target = url.pathname + url.search + url.hash;
      s.startedAt = performance.now();
      document.documentElement.setAttribute("data-transitioning", "");
      if (canvasRef.current) canvasRef.current.style.opacity = "1";
      cancelAnimationFrame(s.frame);
      s.frame = requestAnimationFrame(loop);
    };

    // Capture phase runs before next/link, which skips already-prevented clicks.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [reduceMotion, router]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[90] h-full w-full opacity-0 transition-opacity duration-75"
    />
  );
}

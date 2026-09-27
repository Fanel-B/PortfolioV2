'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export type Side = 'pro' | 'perso';

interface Props {
  side: Side;
}

const STAR_COUNT = 3600;
const FIELD = 100; // les étoiles remplissent un cube de 100 unités autour de la caméra

const vertexShader = /* glsl */ `
  attribute float aSeed;
  attribute float aSize;
  attribute vec3 aColor;

  uniform float uTime;
  uniform float uScale;
  uniform float uWarm;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;

    float twinkle = 0.5 + 0.5 * sin(uTime * (0.6 + aSeed * 2.4) + aSeed * 50.0);
    gl_PointSize = aSize * uScale / -mv.z;

    vec3 warm = mix(vec3(1.0, 0.8, 0.6), vec3(0.93, 0.6, 0.75), fract(aSeed * 7.0));
    vColor = mix(aColor, warm, uWarm);
    vAlpha = mix(0.35, 1.0, twinkle) * smoothstep(0.5, 3.0, -mv.z);
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float core = smoothstep(0.5, 0.0, d);
    float glow = pow(core, 2.4) + 0.12 * core;
    if (glow * vAlpha < 0.004) discard;
    gl_FragColor = vec4(vColor + pow(core, 6.0) * 0.6, glow * vAlpha);
  }
`;

function buildStars() {
  const positions = new Float32Array(STAR_COUNT * 3);
  const colors = new Float32Array(STAR_COUNT * 3);
  const seeds = new Float32Array(STAR_COUNT);
  const sizes = new Float32Array(STAR_COUNT);
  const white = new THREE.Color('#EAF4FF');
  const sky = new THREE.Color('#8ECDF8');
  const lavande = new THREE.Color('#B8A9F5');

  for (let i = 0; i < STAR_COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * FIELD;
    positions[i * 3 + 1] = (Math.random() - 0.5) * FIELD;
    positions[i * 3 + 2] = (Math.random() - 0.5) * FIELD;

    const roll = Math.random();
    const color = roll < 0.55 ? white : roll < 0.9 ? sky : lavande;
    colors.set([color.r, color.g, color.b], i * 3);

    seeds[i] = Math.random();
    // Quelques étoiles bien plus brillantes que les autres.
    sizes[i] = Math.random() < 0.04 ? 0.45 + Math.random() * 0.3 : 0.12 + Math.random() * 0.12;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
  return geometry;
}

export default function SkyBackground({ side }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const warmTarget = useRef(side === 'perso' ? 1 : 0);

  useEffect(() => {
    warmTarget.current = side === 'perso' ? 1 : 0;
  }, [side]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      return; // Pas de WebGL : le dégradé CSS suffit.
    }
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      200
    );
    camera.position.z = 20;

    const geometry = buildStars();
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uScale: { value: (window.innerHeight * pixelRatio) / 2 },
        uWarm: { value: warmTarget.current },
      },
    });
    const stars = new THREE.Points(geometry, material);
    scene.add(stars);

    // Comme sur DevHQ : tant que la souris est décalée du centre, l'univers tourne dans sa direction.
    const mouse = { x: 0, y: 0, smoothX: 0, smoothY: 0 };
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      mouse.x = e.clientX / window.innerWidth - 0.5;
      mouse.y = e.clientY / window.innerHeight - 0.5;
    };
    const onPointerLeave = () => {
      mouse.x = 0;
      mouse.y = 0;
    };
    let lastScroll = window.scrollY;
    let scrollKick = 0;
    const onScroll = () => {
      scrollKick += (window.scrollY - lastScroll) * 0.0004;
      lastScroll = window.scrollY;
    };
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      material.uniforms.uScale.value = (window.innerHeight * pixelRatio) / 2;
    };
    window.addEventListener('pointermove', onPointerMove);
    document.documentElement.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    const clock = new THREE.Clock();
    let frame = 0;

    const tick = () => {
      const dt = Math.min(clock.getDelta(), 0.1);
      const uniforms = material.uniforms;
      uniforms.uWarm.value += (warmTarget.current - uniforms.uWarm.value) * Math.min(1, dt * 2);

      if (!reducedMotion) {
        uniforms.uTime.value = clock.elapsedTime;

        mouse.smoothX += (mouse.x - mouse.smoothX) * Math.min(1, dt * 3);
        mouse.smoothY += (mouse.y - mouse.smoothY) * Math.min(1, dt * 3);
        stars.rotation.y += (0.012 + mouse.smoothX * 0.9) * dt;
        stars.rotation.x += (0.006 + mouse.smoothY * 0.9) * dt + scrollKick;
        scrollKick *= 0.9;
      }

      renderer.render(scene, camera);
      frame = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  const isPerso = side === 'perso';

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#16244A_0%,#0A0E1A_65%)]" />
      <div
        className={`absolute inset-0 bg-[radial-gradient(ellipse_at_top,#2A1A2E_0%,#0F0B12_65%)] transition-opacity duration-700 ${
          isPerso ? 'opacity-100' : 'opacity-0'
        }`}
      />
      {/* Quadrillage d'observatoire, qui s'efface vers le bas */}
      <div
        className={`sky-grid absolute inset-0 transition-opacity duration-700 ${
          isPerso ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <div ref={containerRef} className="absolute inset-0" />
      <div
        className={`grain absolute inset-0 transition-opacity duration-700 ${
          isPerso ? 'opacity-[0.12]' : 'opacity-0'
        }`}
      />
    </div>
  );
}

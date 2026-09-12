'use client';

import { useEffect, useRef } from 'react';

const COLORS = ['#0A0E1A', '#3B82F6', '#1A3A6B'];
const TRAIL_COUNT = 20;
const SEGMENT_COUNT = 50;
const BASE_SPRING = 0.45;
const FRICTION = 0.5;
const DAMPENING = 0.25;
const TENSION = 0.98;

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

class TrailLine {
  spring: number;
  friction: number;
  color: string;
  nodes: Node[];

  constructor(spring: number, color: string, x: number, y: number) {
    this.spring = spring + 0.1 * Math.random() - 0.05;
    this.friction = FRICTION + 0.01 * Math.random() - 0.005;
    this.color = color;
    this.nodes = Array.from({ length: SEGMENT_COUNT }, () => ({ x, y, vx: 0, vy: 0 }));
  }

  update(targetX: number, targetY: number) {
    let spring = this.spring;
    const first = this.nodes[0];
    first.vx += (targetX - first.x) * spring;
    first.vy += (targetY - first.y) * spring;

    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];

      if (i > 0) {
        const prev = this.nodes[i - 1];
        node.vx += (prev.x - node.x) * spring;
        node.vy += (prev.y - node.y) * spring;
        node.vx += prev.vx * DAMPENING;
        node.vy += prev.vy * DAMPENING;
      }

      node.vx *= this.friction;
      node.vy *= this.friction;
      node.x += node.vx;
      node.y += node.vy;
      spring *= TENSION;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(this.nodes[0].x, this.nodes[0].y);

    let x = this.nodes[0].x;
    let y = this.nodes[0].y;

    for (let i = 1; i < this.nodes.length - 2; i++) {
      const a = this.nodes[i];
      const b = this.nodes[i + 1];
      x = (a.x + b.x) * 0.5;
      y = (a.y + b.y) * 0.5;
      ctx.quadraticCurveTo(a.x, a.y, x, y);
    }

    const a = this.nodes[this.nodes.length - 2];
    const b = this.nodes[this.nodes.length - 1];
    ctx.quadraticCurveTo(a.x, a.y, b.x, b.y);
    ctx.stroke();
  }
}

export default function MouseTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    const context = canvasEl?.getContext('2d');
    if (!canvasEl || !context) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasEl;
    const ctx: CanvasRenderingContext2D = context;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let hasMoved = false;

    const lines: TrailLine[] = Array.from(
      { length: TRAIL_COUNT },
      (_, i) =>
        new TrailLine(
          BASE_SPRING + (i / TRAIL_COUNT) * 0.025,
          COLORS[i % COLORS.length],
          mouseX,
          mouseY
        )
    );

    function handlePointerMove(e: PointerEvent) {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      hasMoved = true;
    }

    function handleResize() {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    }

    let frameId = 0;

    function render() {
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.6;

      if (hasMoved) {
        lines.forEach((line) => {
          line.update(mouseX, mouseY);
          line.draw(ctx);
        });
      }

      frameId = requestAnimationFrame(render);
    }

    // The canvas is pointer-events-none (so it never blocks clicks on the content
    // above it), so pointer position is tracked on window instead.
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('resize', handleResize);
    render();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}

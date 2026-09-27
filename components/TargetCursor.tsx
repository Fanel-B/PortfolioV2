'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Side } from './Sky/SkyBackground';

const IDLE_SIZE = 26;
const LOCK_PADDING = 6;
const TARGETS = 'a, button, [role="tab"], [data-cursor]';

interface Props {
  side: Side;
}

// Viseur de télescope : quatre coins autour d'un point, qui se verrouillent sur les éléments cliquables.
export default function TargetCursor({ side }: Props) {
  const [enabled, setEnabled] = useState(false);
  const [locked, setLocked] = useState(false);
  const [visible, setVisible] = useState(false);

  const spring = { stiffness: 450, damping: 35, mass: 0.6 };
  const x = useSpring(-100, spring);
  const y = useSpring(-100, spring);
  const width = useSpring(IDLE_SIZE, spring);
  const height = useSpring(IDLE_SIZE, spring);
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    setEnabled(true);
    document.documentElement.classList.add('has-target-cursor');

    let target: Element | null = null;
    let px = -100;
    let py = -100;

    const place = () => {
      if (target && target.isConnected) {
        const rect = target.getBoundingClientRect();
        x.set(rect.left - LOCK_PADDING);
        y.set(rect.top - LOCK_PADDING);
        width.set(rect.width + LOCK_PADDING * 2);
        height.set(rect.height + LOCK_PADDING * 2);
      } else {
        x.set(px - IDLE_SIZE / 2);
        y.set(py - IDLE_SIZE / 2);
        width.set(IDLE_SIZE);
        height.set(IDLE_SIZE);
      }
    };

    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      dotX.set(px);
      dotY.set(py);
      setVisible(true);
      const next = e.target instanceof Element ? e.target.closest(TARGETS) : null;
      if (next !== target) {
        target = next;
        setLocked(Boolean(next));
      }
      place();
    };
    const onLeave = () => setVisible(false);

    window.addEventListener('pointermove', onMove);
    window.addEventListener('scroll', place, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      document.documentElement.classList.remove('has-target-cursor');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', place);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, [x, y, width, height, dotX, dotY]);

  if (!enabled) return null;

  const color = side === 'perso' ? 'border-perso-accent' : 'border-pro-accent';
  const glow =
    side === 'perso'
      ? 'drop-shadow-[0_0_6px_rgba(242,184,128,0.8)]'
      : 'drop-shadow-[0_0_6px_rgba(142,205,248,0.8)]';
  const corner = `absolute h-2.5 w-2.5 ${color}`;

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-[200] transition-opacity duration-200 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <motion.div style={{ x, y, width, height }} className={`absolute left-0 top-0 ${glow}`}>
        <motion.div
          animate={{ rotate: locked ? 0 : 45 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="relative h-full w-full"
        >
          <span className={`${corner} left-0 top-0 border-l-2 border-t-2`} />
          <span className={`${corner} right-0 top-0 border-r-2 border-t-2`} />
          <span className={`${corner} bottom-0 left-0 border-b-2 border-l-2`} />
          <span className={`${corner} bottom-0 right-0 border-b-2 border-r-2`} />
        </motion.div>
      </motion.div>
      <motion.span
        style={{ x: dotX, y: dotY }}
        className={`absolute -left-[2px] -top-[2px] h-1 w-1 rounded-full ${
          side === 'perso' ? 'bg-perso-accent' : 'bg-pro-accent'
        } ${glow}`}
      />
    </div>
  );
}

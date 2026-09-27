'use client';

import { useEffect, useState } from 'react';

// Tape chaque mot, marque une pause, l'efface, puis passe au suivant.
export function useRotatingTypewriter(words: string[], typeSpeed = 70, pause = 1600): string {
  const [wordIndex, setWordIndex] = useState(0);
  const [output, setOutput] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIndex % words.length];

    if (!deleting && output === word) {
      const timer = setTimeout(() => setDeleting(true), pause);
      return () => clearTimeout(timer);
    }
    if (deleting && output === '') {
      setDeleting(false);
      setWordIndex((i) => i + 1);
      return;
    }

    const timer = setTimeout(
      () =>
        setOutput(deleting ? word.slice(0, output.length - 1) : word.slice(0, output.length + 1)),
      deleting ? typeSpeed / 2 : typeSpeed
    );
    return () => clearTimeout(timer);
  }, [words, wordIndex, output, deleting, typeSpeed, pause]);

  return output;
}

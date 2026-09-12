'use client';

import { useEffect, useState } from 'react';

export function useTypewriter(text: string, speed = 45): string {
  const [output, setOutput] = useState('');

  useEffect(() => {
    setOutput('');
    let i = 0;

    const interval = setInterval(() => {
      i += 1;
      setOutput(text.slice(0, i));

      if (i >= text.length) {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return output;
}

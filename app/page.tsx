'use client';

import Footer from '@/components/Footer';
import FlipCard from '@/components/FlipCard/FlipCard';
import Hero from '@/components/Hero/Hero';
import Navbar from '@/components/Navbar/Navbar';
import Outils from '@/components/Outils/Outils';
import Personnalite from '@/components/Personnalite/Personnalite';
import QuiJeSuis from '@/components/QuiJeSuis/QuiJeSuis';
import Travail from '@/components/Travail/Travail';
import { useState } from 'react';

export default function Page() {
  const [isFlipped, setIsFlipped] = useState(false);

  const front = (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-pro-bg dark:text-pro-text">
      <Navbar onOpenPersonality={() => setIsFlipped(true)} />
      <Hero />
      <QuiJeSuis onOpenPersonality={() => setIsFlipped(true)} />
      <Outils />
      <Travail />
      <Footer />
    </div>
  );

  const back = <Personnalite onClose={() => setIsFlipped(false)} />;

  return <FlipCard front={front} back={back} isFlipped={isFlipped} />;
}

import { ImageResponse } from 'next/server';

export const runtime = 'edge';
export const alt = 'Fanel Balemo — Développeur Full Stack & Data Analyst';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Image d'aperçu affichée quand le lien du portfolio est partagé (LinkedIn, Slack…).
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 80,
          background: 'radial-gradient(ellipse at top, #16244A 0%, #0A0E1A 65%)',
          color: '#E2E8F0',
        }}
      >
        <div style={{ fontSize: 36, color: '#8ECDF8', letterSpacing: 4 }}>FB.</div>
        <div style={{ fontSize: 88, fontWeight: 700, marginTop: 24 }}>Fanel Balemo</div>
        <div
          style={{
            fontSize: 40,
            marginTop: 16,
            backgroundImage: 'linear-gradient(90deg, #8ECDF8, #B8A9F5, #9EE6CF)',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          Développeur Full Stack · Data Analyst
        </div>
        <div style={{ fontSize: 28, marginTop: 40, color: '#9EE6CF' }}>
          ● En recherche d&apos;alternance — Toulouse
        </div>
      </div>
    ),
    size
  );
}

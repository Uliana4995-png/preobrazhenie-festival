import { ImageResponse } from 'next/og';
import { getSiteConfig } from '@/lib/content';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  const site = await getSiteConfig();

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: 'linear-gradient(135deg, #160821 0%, #241143 55%, #160821 100%)',
          color: '#F3ECFA',
          fontFamily: 'serif'
        }}
      >
        <div style={{ display: 'flex', fontSize: 26, color: '#D8B26B', marginBottom: 20 }}>
          {site.dates.display} · {site.location.region}
        </div>
        <div style={{ display: 'flex', fontSize: 64, lineHeight: 1.1, maxWidth: 950 }}>{site.title}</div>
        <div style={{ display: 'flex', fontSize: 32, marginTop: 24, color: '#E23FC0' }}>«{site.slogan}»</div>
      </div>
    ),
    { ...size }
  );
}

/* eslint-disable @next/next/no-img-element -- next/og renders plain <img> */
import { ImageResponse } from 'next/og';
import { brandMarkDataUri } from '@/lib/brand-mark';

export const alt = 'Gatherfund LLC — Good things begin when we gather.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  const mark = await brandMarkDataUri();

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: '#faf9fd',
          color: '#211b2d',
          position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', right: -120, top: -60, width: 620, height: 620, borderRadius: 9999, background: '#e9e0f3' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <img src={mark} width={64} height={61} alt="" />
          <div style={{ fontSize: 52, fontWeight: 700, letterSpacing: -2 }}>gatherfund</div>
          <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: 2, marginTop: 18 }}>LLC</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: 4, color: '#6941a5', marginBottom: 24 }}>
            MANY POSSIBILITIES. ONE SHARED PURPOSE.
          </div>
          <div style={{ fontSize: 92, fontWeight: 700, letterSpacing: -4, lineHeight: 1.02, display: 'flex', flexDirection: 'column' }}>
            <span>Good things begin</span>
            <span>
              when we&nbsp;<span style={{ color: '#6941a5' }}>gather.</span>
            </span>
          </div>
        </div>
        <img src={mark} width={300} height={287} alt="" style={{ position: 'absolute', right: 90, top: 110, opacity: 0.9 }} />
      </div>
    ),
    size,
  );
}

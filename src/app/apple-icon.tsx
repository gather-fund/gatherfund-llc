/* eslint-disable @next/next/no-img-element -- next/og renders plain <img> */
import { ImageResponse } from 'next/og';
import { brandMarkDataUri } from '@/lib/brand-mark';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default async function AppleIcon() {
  const mark = await brandMarkDataUri();

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#faf9fd' }}>
        <img src={mark} width={128} height={122} alt="" />
      </div>
    ),
    size,
  );
}

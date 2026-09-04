import { ImageResponse } from 'next/og';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #241143, #160821)',
          borderRadius: 14
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            background: 'linear-gradient(135deg, #E23FC0, #2FD9C4)',
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
          }}
        />
      </div>
    ),
    { ...size }
  );
}

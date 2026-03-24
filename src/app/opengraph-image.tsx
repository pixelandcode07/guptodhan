import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Guptodhan - Online Marketplace Bangladesh'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#1a56db',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 'bold', marginBottom: 20 }}>
          Guptodhan
        </div>
        <div style={{ fontSize: 32, opacity: 0.9 }}>
          Online Marketplace Bangladesh
        </div>
        <div style={{ fontSize: 22, opacity: 0.7, marginTop: 16 }}>
          Buy • Sell • Donate • Services
        </div>
      </div>
    ),
    { ...size }
  )
}
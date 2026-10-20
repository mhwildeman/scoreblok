import type { MetadataRoute } from 'next';
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/', name: 'Scoreblok', short_name: 'Scoreblok',
    description: 'Houd spelers, rondes en scores bij.', lang: 'nl',
    start_url: '/', scope: '/', display: 'standalone',
    background_color: '#f8f9f3', theme_color: '#285d46',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}

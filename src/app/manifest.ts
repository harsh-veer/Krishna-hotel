import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Krishna Hotel',
    short_name: 'Krishna Hotel',
    description: 'Krishna Hotel - Comfortable & Affordable Stay in Ambedkar Nagar',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#991b1b',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}

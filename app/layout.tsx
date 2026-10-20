import type { Metadata, Viewport } from 'next';
import './globals.css';
export const metadata: Metadata = {
 title: 'Scoreblok', description: 'Houd spelers, rondes en scores bij.',
 applicationName: 'Scoreblok', appleWebApp: { capable: true, title: 'Scoreblok', statusBarStyle: 'default' },
 icons: { icon: '/icons/icon.svg', apple: '/icons/apple-touch-icon.png' },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#285d46', viewportFit: 'cover' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="nl"><body>{children}</body></html>; }

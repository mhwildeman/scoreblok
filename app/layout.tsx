import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Scoreblok · Nog een potje?', description: 'Jouw digitale scoreblok. Bewaar spelers, houd rondes bij en speel verder waar je gebleven was.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="nl"><body>{children}</body></html>; }

import type { Metadata } from 'next';
import { Permanent_Marker } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

const graffiti = Permanent_Marker({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-graffiti',
});

export const metadata: Metadata = {
  title: 'QuickPulse',
  description: 'Organiza tus recibos por listas y controla tus gastos del mes.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="es" className={graffiti.variable}>
        <body className="font-sans antialiased bg-slate-950 text-white">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
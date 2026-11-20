import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: 'QuickPulse',
  description: 'Organiza tus recibos por listas y controla tus gastos del mes.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="es" className={outfit.variable}>
        <body className="font-sans antialiased bg-slate-950 text-white">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
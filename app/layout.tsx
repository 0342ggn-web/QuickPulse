import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const font = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  weight: ['400', '600', '700', '800']
})

export const metadata: Metadata = {
  title: 'QuickPulse',
  description: 'Hábitos y gastos al instante',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={font.className}>{children}</body>
    </html>
  )
}
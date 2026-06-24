import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DreamReader — Romans interactifs',
  description: 'Lisez, votez, influencez. La plateforme de romans interactifs en français.',
  keywords: 'romans, lecture, interactif, vote, fiction française',
  openGraph: {
    title: 'DreamReader',
    description: 'L\'histoire que vous écrivez.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" translate="no">
      <head>
        <meta name="google" content="notranslate" />
        <meta httpEquiv="Content-Language" content="fr" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#f5f0e8" />
      </head>
      <body>{children}</body>
    </html>
  )
}

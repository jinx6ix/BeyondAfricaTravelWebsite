import type { Metadata } from 'next'
import { DM_Sans, Cormorant_Garamond } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import Providers from './providers'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['300', '400', '500', '600'],
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'Savanna & Beyond | East Africa Safari & Travel Agency',
    template: '%s | Savanna & Beyond',
  },
  description: "East Africa's most trusted travel agency. Bespoke safaris, Kilimanjaro treks, gorilla trekking and cultural tours across Kenya, Tanzania, Rwanda and Ethiopia.",
  keywords: ['East Africa safari', 'Kenya safari', 'Kilimanjaro trek', 'Rwanda gorilla trekking', 'Tanzania tour', 'travel agency Nairobi', 'Masai Mara', 'Zanzibar'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Savanna & Beyond Travel',
    title: 'Savanna & Beyond | East Africa Safaris & Tours',
    description: 'Bespoke safaris and journeys across East Africa crafted by local experts since 2009.',
  },
  twitter: { card: 'summary_large_image', title: 'Savanna & Beyond | East Africa Safaris' },
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${cormorant.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'TravelAgency',
              name: 'Savanna & Beyond Travel Agency',
              description: "East Africa's premier safari and travel agency",
              url: process.env.NEXT_PUBLIC_APP_URL,
              telephone: '+254700723274',
              email: 'hello@savannaandbeyond.co.ke',
              address: { '@type': 'PostalAddress', streetAddress: 'Westlands Business Park', addressLocality: 'Nairobi', addressCountry: 'KE' },
              openingHours: 'Mo-Sa 08:00-18:00',
              priceRange: '$$$$',
              aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '540' },
            }),
          }}
        />
      </head>
      <body className="bg-cream font-sans text-gray-900 antialiased" suppressHydrationWarning>
        <Providers>
          <Toaster position="top-right" toastOptions={{ duration: 4000, style: { background: '#1B3A2D', color: '#fff', borderRadius: '10px', fontSize: '14px' } }} />
          {children}
        </Providers>
      </body>
    </html>
  )
}

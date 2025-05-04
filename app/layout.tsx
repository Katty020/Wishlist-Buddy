import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'wishlist',
  description: 'Created by Aryan',
  generator: '',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

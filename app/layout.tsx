import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Equine Acres - Horse Farm Simulator',
  description: 'A text-based horse farm management simulation game',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}

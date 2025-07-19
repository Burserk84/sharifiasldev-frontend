import type { Metadata } from 'next'
// Import Vazirmatn from next/font
import { Vazirmatn } from 'next/font/google'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import '../globals.css'

// Configure the font
const vazirmatn = Vazirmatn({ subsets: ['latin', 'arabic'] })

export const metadata: Metadata = {
  title: 'SharifiaslDev',
  description: 'Full-stack developer portfolio',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className={`${vazirmatn.className} bg-primary-dark text-text-primary flex flex-col min-h-screen`} suppressHydrationWarning>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
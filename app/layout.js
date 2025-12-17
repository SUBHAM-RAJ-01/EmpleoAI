import './globals.css'
import { Inter } from 'next/font/google'
import { SessionProvider } from '@/components/providers/SessionProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'EmpleoAI - AI-Powered Placement Co-Pilot',
  description: 'Automate placement emails, tailor resumes intelligently, and track every application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}

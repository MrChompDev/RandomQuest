import './globals.css'
import { Space_Grotesk, Manrope, JetBrains_Mono } from 'next/font/google'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' })
const manrope = Manrope({ subsets: ['latin'], variable: '--font-body' })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-code' })

export const metadata = {
  title: 'Random Quest',
  description: 'Your screen gives you a quest. The world is the game.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${manrope.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <body className="font-body min-h-screen antialiased text-slate-900">
        {children}
      </body>
    </html>
  )
}

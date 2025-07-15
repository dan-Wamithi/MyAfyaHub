import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/hooks/useAuth"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "AfyaHub - Reliable Health Information for Kenya",
  description:
    "Improving access to reliable health information for Kenyan communities. Get verified health articles, vaccination schedules, and emergency contacts.",
  keywords: "health, Kenya, medical information, vaccination, emergency contacts, healthcare",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}

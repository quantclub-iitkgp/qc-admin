import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import { ThemeProvider } from "next-themes"
import { Toaster } from "sonner"
import "./globals.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
})

export const metadata: Metadata = {
  title: "Quant Club Admin",
  description: "CRM admin panel for Quant Club IIT KGP",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.variable} font-[family-name:var(--font-dm-sans)] antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}

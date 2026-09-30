import "styles/globals.scss"
import "styles/critical.scss"
import { AuthProvider } from "lib/auth"
import type { Metadata } from "next"
import { fontBody, fontDisplay, fontHand } from "styles/fonts"

export const metadata: Metadata = {
  title: "Wischlist",
  description: "Deine persönliche Wunschliste für Freunde und Familie!",
  manifest: "/manifest.json",
  icons: { icon: "/favicon.ico" },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4ecdd" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1512" },
  ],
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Wischlist" },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html
      lang="de"
      className={`${fontBody.variable} ${fontDisplay.variable} ${fontHand.variable}`}
    >
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}

import "styles/globals.scss"
import "styles/critical.scss"
import { AuthProvider } from "lib/auth"
import { DialogProvider } from "components/Dialog/Dialog"
import type { Metadata, Viewport } from "next"
import { fontBody, fontDisplay, fontHand, fontLabel } from "styles/fonts"

export const metadata: Metadata = {
  title: "Wischlist",
  description: "Deine persönliche Wunschliste für Freunde und Familie!",
  manifest: "/manifest.json",
  icons: { icon: "/favicon.ico" },
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Wischlist" },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4ecdd" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1512" },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="de"
      className={`${fontBody.variable} ${fontDisplay.variable} ${fontHand.variable} ${fontLabel.variable}`}
    >
      <body>
        <AuthProvider>
          <DialogProvider>{children}</DialogProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

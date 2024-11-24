import "styles/globals.scss"
import "styles/critical.scss"
import { AuthProvider } from "lib/auth"
import Head from "next/head"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html>
      <Head>
        <title>Wischlist</title>
        <meta name="viewport" content="width=device-width" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      </Head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}

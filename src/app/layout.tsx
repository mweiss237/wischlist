import "styles/globals.scss"
import "styles/critical.scss"
import { AuthProvider } from "lib/auth"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html>
      <head>
        <title>Wischlist</title>
        <meta name="viewport" content="width=device-width" />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}

import "../src/styles/globals.scss"
import "../src/styles/critical.scss"

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
        {children}
      </body>
    </html>
  )
}

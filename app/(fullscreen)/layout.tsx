import "../../src/styles/globals.scss"
import "../../src/styles/critical.scss"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main>
      <span className="crit_content">{children}</span>
    </main>
  )
}

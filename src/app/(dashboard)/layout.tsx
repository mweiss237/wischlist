import Footer from "components/Footer/Footer"
import Header from "components/Header/Header"
import "styles/globals.scss"
import "styles/critical.scss"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="app_container">
        <span className="crit_content">{children}</span>
      </main>
      <Footer />
    </>
  )
}

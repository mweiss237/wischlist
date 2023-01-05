import Footer from "components/Footer/Footer"
import Header from "components/Header/Header"
import "../../src/styles/globals.scss"
import "../../src/styles/critical.scss"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* <Header /> */}
      <main>
        <span className="crit_content">{children}</span>
      </main>
      {/* <Footer /> */}
    </>
  )
}

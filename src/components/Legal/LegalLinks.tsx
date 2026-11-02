import Link from "next/link"
import styles from "./Legal.module.scss"

const LegalLinks = () => (
  <nav className={styles.links} aria-label="Rechtliches">
    <Link href="/impressum">Impressum</Link>
    <Link href="/datenschutz">Datenschutz</Link>
  </nav>
)

export default LegalLinks

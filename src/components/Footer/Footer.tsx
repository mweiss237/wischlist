import { getVersion } from "lib/env"
import Link from "next/link"

const Footer = () => {
  const year = new Date().getFullYear()
  return (
    <footer className="crit_footer">
      <div className="crit_footer_paper">
        <p>
          © {year} <Link href={"https://www.moritz-weiss.dev"} target={"_blank"}>Moritz Weiss</Link> · Wischlist v{getVersion()}
        </p>
      </div>
    </footer>
  )
}

export default Footer

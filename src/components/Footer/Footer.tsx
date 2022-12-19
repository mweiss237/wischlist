import { getVersion } from "lib/env"

const Footer = () => {
  const year = new Date().getFullYear()
  return (
    <footer className="crit_footer">
      <p>© {year} - Moritz Weiss | Wischlist v{getVersion()}</p>
    </footer>
  )
}

export default Footer

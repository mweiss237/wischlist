"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useUser } from "lib/auth"
import { Gift, Home, LogIn, Star, User } from "react-feather"
import styles from "./Header.module.scss"

const navItems = [
  { href: "/", label: "Start", Icon: Home },
  { href: "/list", label: "Meine Listen", Icon: Gift },
  { href: "/list/favorites", label: "Favoriten", Icon: Star },
]

// most specific match wins, so /list/favorites does not also light up /list
const findActiveHref = (pathname: string) =>
  navItems
    .filter(({ href }) => href === pathname || (href !== "/" && pathname.startsWith(`${href}/`)))
    .reduce<string | null>((best, { href }) => (!best || href.length > best.length ? href : best), null)

const Header = () => {
  const { user } = useUser()
  const pathname = usePathname() || "/"
  const activeHref = findActiveHref(pathname)
  const isAccountActive = ["/profile", "/auth", "/login", "/register"].includes(pathname)

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} aria-label="Wischlist Startseite">
          <span className={styles.logo}>
            <Image src="/wischlist-color.svg" alt="" width={34} height={34} unoptimized />
          </span>
          <span className={styles.wordmark}>Wischlist</span>
        </Link>

        <nav className={styles.nav} aria-label="Hauptnavigation">
          {navItems.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className={`${styles.navLink} ${activeHref === href ? styles.active : ""}`}
              aria-current={activeHref === href ? "page" : undefined}
            >
              <Icon size={18} aria-hidden />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <Link
          href={user ? "/profile" : "/auth"}
          className={`${styles.account} ${isAccountActive ? styles.accountActive : ""}`}
          title={user ? "Profil" : "Anmelden"}
        >
          {user?.photoURL ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.photoURL} alt="" className={styles.avatar} />
          ) : user ? (
            <User size={18} aria-hidden />
          ) : (
            <LogIn size={18} aria-hidden />
          )}
          <span className={styles.accountLabel}>
            {user ? user.displayName || "Profil" : "Anmelden"}
          </span>
        </Link>
      </div>
    </header>
  )
}

export default Header

"use client"

import Image from "next/image"
import styles from "./Header.module.scss"
import Link from "next/link"
import { Indie_Flower } from "next/font/google"
import { useUser } from "lib/auth"
import { LogIn, User } from "react-feather"

const indieFlower = Indie_Flower({ weight: "400", subsets: ["latin"] })

const Header = () => {
  const { user, loading } = useUser()

  return (
    <>
      <div className="crit_header">
        <Link href="/" className="crit_header_logo">
          <Image
            src={"/wischlist-color.svg"}
            alt="wischlist logo"
            width={60}
            height={60}
            unoptimized
          />
        </Link>

        <h1 className={`crit_header_title ${styles.headline} ${indieFlower.className}`}>Wischlist</h1>
      </div>
      <nav className="crit_navigator">
        <span className="align-start">
          <Link
            href={"/"}
            key="home"
            id="home">
            Home
          </Link>
          <Link
            href={"/list"}
            key={"lists"}
            id={"lists"}>
            Lists
          </Link>
        </span>
        <span className="align-end">
          <Link
            href={"/list/favorites"}
            key={"favorites"}
            id={"favorites"}>
            Favoriten
          </Link>
          <Link href={user ? "/profile" : "/auth"}>
            {user ? <User size={18} /> : <LogIn size={18} />}
          </Link>
        </span>
      </nav>
    </>
  )
}

export default Header

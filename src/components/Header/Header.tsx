"use client"

import Image from "next/image"
import styles from "./Header.module.scss"
import Link from "next/link"
import { Indie_Flower } from "@next/font/google"
import { useUser } from "lib/auth"

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
          <Link href={user ? "/profile" : "/login"}>
            <Image
              src={user ? "/user-active.svg" : "/user.svg"}
              width={18}
              height={18}
              style={{ position: "relative" }}
              alt="Login"
            />
          </Link>
        </span>
      </nav>
    </>
  )
}

export default Header

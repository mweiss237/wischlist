"use client"
import React from "react"
import { useAuth, useUser } from "lib/auth"

import Image from "next/image"
import Link from "next/link"
import { Camera, Gift, LogOut } from "react-feather"
import { useRouter } from "next/navigation"
import Loading from "components/Loading/Loading"
import styles from "./Profile.module.scss"

const Profile = () => {
  const { user, updateUserName, updateProfilePicture } = useUser()
  const [name, setName] = React.useState(user?.displayName || "")
  const { logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/auth")
  }

  React.useEffect(() => {
    if (user?.displayName) setName(user.displayName)
  }, [user, setName])

  const handleChangeName: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setName(event.target.value)
  }

  const handleBlur: React.FocusEventHandler<HTMLInputElement> = () => {
    updateUserName(name)
  }

  const handleClickImage = () => {
    document.getElementById("image-input")?.click()
  }
  const handleChangeImage: React.ChangeEventHandler<HTMLInputElement> = ({ target }) => {

    const file = target.files && target.files[0]
    if (!file) return

    updateProfilePicture(file)
  }

  if (!user) return <Loading />

  return (
    <div className={`${styles.container} paper`}>
      <span className={styles.banner} aria-hidden />
      <button type="button" className={styles.avatar} onClick={handleClickImage} title="Profilbild ändern">
        <Image
          src={user.photoURL || "https://via.placeholder.com/150.png"}
          alt="Profilbild"
          width="120"
          height="120"
          unoptimized
        />
        <span className={styles.avatarOverlay}>
          <Camera size={20} aria-hidden />
        </span>
      </button>
      <input id="image-input" type={"file"} accept="image/*" className={styles.hidden} onChange={handleChangeImage} />

      <span className="eyebrow">Mein Wischlist Profil</span>
      <label className="sr_only" htmlFor="display-name">Anzeigename</label>
      <input
        id="display-name"
        type="text"
        className={styles.nameInput}
        value={name}
        placeholder="Dein Name"
        onChange={handleChangeName}
        onBlur={handleBlur}
      />
      <p className={styles.email}>{user.email}</p>

      <div className={styles.actions}>
        <Link href="/list" className="btn btn-primary">
          <Gift size={18} aria-hidden /> Meine Listen
        </Link>
        <button type="button" className="btn btn-ghost" onClick={handleLogout}>
          <LogOut size={18} aria-hidden /> Ausloggen
        </button>
      </div>
    </div>
  )
}

export default Profile

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
    <div className={styles.container}>
      <header className="page_header">
        <h1>Profil</h1>
        <p>So stehst du als Absender auf deinen Listen.</p>
      </header>

      {/* the owner is a shipping label: sender, name, address */}
      <div className={`shipping_label ${styles.label}`}>
        <div className={styles.labelHead}>
          <span className="field_key">Absender</span>
          <span className="barcode" aria-hidden />
        </div>
        <div className={styles.labelBody}>
          <button type="button" className={styles.avatar} onClick={handleClickImage} title="Profilbild ändern">
            <Image
              src={user.photoURL || "https://via.placeholder.com/150.png"}
              alt="Profilbild"
              width="96"
              height="96"
              unoptimized
            />
            <span className={styles.avatarOverlay}>
              <Camera size={20} aria-hidden />
            </span>
          </button>
          <input id="image-input" type={"file"} accept="image/*" className={styles.hidden} onChange={handleChangeImage} />

          <div className={styles.fields}>
            <label className="field" htmlFor="display-name">
              <span className="field_key">Name</span>
              <input
                id="display-name"
                type="text"
                className={`crit_textinput ${styles.nameInput}`}
                value={name}
                placeholder="Dein Name"
                onChange={handleChangeName}
                onBlur={handleBlur}
              />
            </label>
            <div className="field">
              <span className="field_key">E-Mail</span>
              <span className={`field_value ${styles.email}`}>{user.email}</span>
            </div>
          </div>
        </div>
      </div>

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

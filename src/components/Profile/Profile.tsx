"use client"
import React from "react"
import { useAuth, useUser } from "lib/auth"

import Image from "next/image"
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

  return (
    <div className={styles.container}>

      <h2>Profil</h2>

      <div className={styles.centered}>
        {user ? (
          <>
            <Image
              src={user?.photoURL || "https://via.placeholder.com/150.png"}
              alt="profile picture"
              style={{ borderRadius: "50%", boxShadow: "0 1px 5px lightgray" }}
              width="150"
              height="150"
              onClick={handleClickImage}
            />
            <input id="image-input" type={"file"} className={styles.hidden} onChange={handleChangeImage} />

            <div>
              <input
                type="text"
                className="crit_textinput"
                style={{ width: "auto", marginTop: "1rem" }}
                value={name}
                onChange={handleChangeName}
                onBlur={handleBlur}
              />
            </div>
            <p style={{ fontSize: "1.2rem" }}>Mein Wischlist Profil</p>
          </>) : <Loading />}
      </div>
      <button onClick={handleLogout}>Ausloggen</button>
    </div>
  )
}

export default Profile

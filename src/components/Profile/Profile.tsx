"use client"
import React from "react"
import { useAuth, useUser } from "lib/auth"

import Image from "next/image"
import { useRouter } from "next/navigation"
import Loading from "components/Loading/Loading"

const Profile = () => {
  const { user, updateUserName } = useUser()
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

  return (
    <div style={{ width: "50%", minWidth: "300px", margin: "0 auto" }}>
      <div style={{ marginTop: "2rem" }}>
        <h2>Profil</h2>
      </div>
      <div style={{ textAlign: "center" }}>
        {user ? (
          <>
            <Image
              src={user?.photoURL || "https://via.placeholder.com/150.png"}
              alt="profile"
              style={{ borderRadius: "50%", boxShadow: "0 1px 5px lightgray" }}
              width="150"
              height="150"
            />

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

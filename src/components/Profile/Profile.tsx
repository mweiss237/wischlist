"use client"
import { useAuth, useUser } from "lib/auth"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useCallback } from "react"

const Profile = () => {
  const { user, updateUserName } = useUser()
  const { logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  const handleChangeName = useCallback(async () => {
    const value = prompt("Dein Nutzername:", user?.displayName || "")
    if (value === null) return

    await updateUserName(value)

  }, [user?.displayName, updateUserName])

  console.log(user?.displayName)

  return (
    <div style={{ width: "50%", minWidth: "300px", margin: "0 auto" }}>
      <div style={{ marginTop: "2rem" }}>
        <h2>Profil</h2>
      </div>
      <div style={{ textAlign: "center" }}>
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
            readOnly
            style={{ width: "auto", marginTop: "1rem" }}
            value={user?.displayName || ""}
            onClick={handleChangeName}
          />
        </div>
        <p style={{ fontSize: "1.2rem" }}>Mein Wischlist Profil</p>
      </div>
      <button onClick={handleLogout}>Ausloggen</button>
    </div>
  )
}

export default Profile

"use client"
import Loading from "components/Loading/Loading"
import { useAuth } from "lib/auth"

import Image from "next/image"

const Profile = () => {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }


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
        <h1 style={{ marginTop: "1rem" }}>{user?.displayName}</h1>
        <p style={{ fontSize: "1.2rem" }}>Mein Wischlist Profil</p>
      </div>
      <button onClick={handleLogout}>Ausloggen</button>
    </div>
  )
}

export default Profile

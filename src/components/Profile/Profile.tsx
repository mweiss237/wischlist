"use client"
import Loading from "components/Loading/Loading"
import { logout } from "lib/client/authClient"
import useUser from "lib/hooks/useUser"
import Image from "next/image"

type ProfileParams = {}

const Profile = () => {
  const { user, mutateUser, loading } = useUser({
    redirectTo: "/login",
    redirectIfFound: false,
  })
  const handleLogout = async () => {
    const response = await logout()
    mutateUser(response)
  }

  if (loading) return <Loading />

  return (
    <div style={{ width: "50%", minWidth: "300px", margin: "0 auto" }}>
      <div style={{ marginTop: "2rem" }}>
        <h2>Profile</h2>
      </div>
      <div style={{ textAlign: "center" }}>
        <Image
          src="https://via.placeholder.com/150.png"
          alt="profile"
          style={{ borderRadius: "50%", boxShadow: "0 1px 5px lightgray" }}
          width="150"
          height="150"
        />
        <h1 style={{ marginTop: "1rem" }}>{user?.username}</h1>
        <p style={{ fontSize: "1.2rem" }}>Got some wishes?</p>
      </div>
      <button onClick={handleLogout}>Ausloggen</button>
    </div>
  )
}

export default Profile

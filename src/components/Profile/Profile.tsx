"use client"
import { logout } from "lib/client/authClient"
import useUser from "lib/hooks/useUser"

type ProfileParams = {}

const Profile = (props: ProfileParams) => {
  const { user, mutateUser } = useUser({
    redirectTo: "/login",
    redirectIfFound: false,
  })
  const handleLogout = async () => {
    const response = await logout()
    mutateUser(response)
  }

  return (
    <>
      <h1>Profil: {user?.username}</h1>
      <button onClick={handleLogout}>Ausloggen</button>
    </>
  )
}

export default Profile

"use client"

import React, { useEffect } from "react"
import styles from "./Auth.module.scss"
import { useAuth, useUser } from "lib/auth"
import { useRouter, useSearchParams } from "next/navigation"

const ForgotPassword = () => {
  const { user } = useUser()
  const { resetPassword } = useAuth()
  const router = useRouter()
  const { get } = useSearchParams()
  const [email, setEmail] = React.useState(get("email") || "")

  const handleReset: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault()

    if (!email) return

    resetPassword(email)
    alert("Eine Email zum Passwort zurücksetzen wurde an die eingetragene Adresse verschickt.")

    router.push(`/auth?email=${email}`)
  }

  useEffect(() => {
    if (user) router.push("/profile")
  }, [router, user])

  return (
    <form className={styles.wrapper}>
      <label className={styles.inputlabel} htmlFor="#email">
        Email
      </label>
      <input
        id="email"
        type={"email"}
        className={styles.textfield}
        value={email}
        onChange={(event) => setEmail(event.currentTarget.value)}
        placeholder="E-Mail"
      />

      <span className={styles.buttonWrapper}>
        <button type={"submit"} onClick={handleReset}>Passwort zurücksetzen</button>
      </span>
    </form>
  )
}

export default ForgotPassword

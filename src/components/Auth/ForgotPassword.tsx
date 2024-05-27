"use client"

import React, { useEffect } from "react"
import styles from "./Auth.module.scss"
import { useAuth, useUser } from "lib/auth"
import { useRouter } from "next/navigation"

const ForgotPassword = () => {
  const { user } = useUser()
  const { resetPassword } = useAuth()
  const router = useRouter()
  const emailRef = React.useRef<HTMLInputElement>(null)

  const handleReset: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault()
    const email = emailRef.current?.value

    if (!email) return

    resetPassword(email)
    alert("Eine Email zum Passwort zurücksetzen wurde an die eingetragene Adresse verschickt.")

    router.push("/login")
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
        ref={emailRef}
        placeholder="Email"
      />

      <span className={styles.buttonWrapper}>
        <button type={"submit"} onClick={handleReset}>Passwort zurücksetzen</button>
      </span>
    </form>
  )
}

export default ForgotPassword

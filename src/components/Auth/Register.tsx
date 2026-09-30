"use client"

import { useAuth, useUser } from "lib/auth"
import { useRouter, useSearchParams } from "next/navigation"
import React, { FormEvent, useState, useEffect } from "react"
import styles from "./Auth.module.scss"

const Register = () => {
  const { user } = useUser()
  const router = useRouter()
  const { register } = useAuth()
  const { get } = useSearchParams()

  const email = get("email") || ""
  const [password, setPassword] = React.useState("")
  const [username, setUsername] = React.useState("")

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) router.push("/profile")
  }, [user])

  const handleSignup = async (e: FormEvent) => {
    setLoading(true)
    e.preventDefault()

    if (!email || !username || !password) return

    await register(
      email,
      password,
      username
    )

    setLoading(false)
  }

  if (!email) return router.push("/auth")

  return (
    <form onSubmit={handleSignup} className={styles.wrapper}>
      <div className={styles.heading}>
        <span className="eyebrow">Neu hier?</span>
        <h1>Konto erstellen</h1>
        <p>Nur noch Name und Passwort – dann kann es losgehen.</p>
      </div>
      <label className={styles.inputlabel} htmlFor="email">
        E-Mail
      </label>
      <input
        id="email"
        type={"email"}
        className={styles.textfield}
        value={email}
        placeholder="E-Mail"
        disabled
      />
      <label className={styles.inputlabel} htmlFor="username">
        Nutzername
      </label>
      <input
        id="username"
        type={"username"}
        className={styles.textfield}
        value={username}
        onChange={(event) => setUsername(event.currentTarget.value)}
        placeholder="Benutzername"
        disabled={loading}
      />
      <label className={styles.inputlabel} htmlFor="password">
        Passwort
      </label>
      <input
        id="password"
        type={"password"}
        className={styles.textfield}
        value={password}
        onChange={(event) => setPassword(event.currentTarget.value)}
        placeholder="Passwort"
        disabled={loading}
      />
      <span className={styles.buttonWrapper}>
        <button type={"button"} className="btn btn-ghost" disabled={loading} onClick={() => router.push("/auth")}>E-Mail ändern</button>
        <button type={"submit"} className="btn btn-primary" disabled={loading}>Registrieren</button>
      </span>
    </form>
  )
}

export default Register

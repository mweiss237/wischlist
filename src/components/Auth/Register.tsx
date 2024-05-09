"use client"

import { useAuth, useUser } from "lib/auth"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { FormEvent, useState, useEffect } from "react"
import styles from "./Auth.module.scss"

const Register = () => {
  const emailRef = React.useRef<HTMLInputElement>(null)
  const usernameRef = React.useRef<HTMLInputElement>(null)
  const passwordRef = React.useRef<HTMLInputElement>(null)

  const { register } = useAuth()
  const { user } = useUser()
  const router = useRouter()

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) router.push("/profile")
  }, [user])

  const authorize = async (e: FormEvent) => {
    setLoading(true)
    e.preventDefault()
    const email = emailRef.current?.value
    const username = usernameRef.current?.value
    const password = passwordRef.current?.value
    if (!email || !username || !password) return

    await register(
      email,
      password,
      username
    )

    setLoading(false)
  }

  return (
    <form onSubmit={authorize} className={styles.wrapper}>
      <label className={styles.inputlabel} htmlFor="#email">
        Email
      </label>
      <input
        id="email"
        type={"email"}
        className={styles.textfield}
        ref={emailRef}
        placeholder="Email"
        disabled={loading}
      />
      <label className={styles.inputlabel} htmlFor="#username">
        Nutzername
      </label>
      <input
        id="username"
        type={"username"}
        className={styles.textfield}
        ref={usernameRef}
        placeholder="Username"
        disabled={loading}
      />
      <label className={styles.inputlabel} htmlFor="#password">
        Passwort
      </label>
      <input
        id="password"
        type={"password"}
        className={styles.textfield}
        ref={passwordRef}
        placeholder="Passwort"
        disabled={loading}
      />
      <span className={styles.buttonWrapper}>
        <button type={"submit"} disabled={loading}>Registrieren</button>
        <button type={"reset"} disabled={loading}>Zurücksetzen</button>
      </span>
      <br />
      <p className={styles.darktext}>
        Schon registriert? <Link href={`/login`}>Hier anmelden</Link>
      </p>
    </form>
  )
}

export default Register

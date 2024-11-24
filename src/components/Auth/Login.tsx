"use client"

import Link from "next/link"
import React, { FormEvent, useEffect, useState } from "react"
import styles from "./Auth.module.scss"
import Loading from "components/Loading/Loading"
import { useAuth, useUser } from "lib/auth"
import { useRouter, useSearchParams } from "next/navigation"

const Login = () => {
  const { user } = useUser()
  const { login } = useAuth()
  const router = useRouter()
  const { get } = useSearchParams()



  const [loading, setLoading] = useState(false)
  const email = get("email") || ""
  const [password, setPassword] = React.useState("")



  if (!email) return router.push("/auth")

  const handleLogin = async (e: FormEvent) => {
    setLoading(true)

    e.preventDefault()

    if (!email || !password) return

    try {
      await login(
        email,
        password,
      )
    } catch (e) {
      alert("Die Anmeldung ist fehlgeschlagen! Überprüfe deine E-Mail oder dein Passwort.")
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    if (user) router.push("/profile")
  }, [router, user])


  if (loading) return <Loading />



  return (
    <form onSubmit={handleLogin} className={styles.wrapper}>
      <label className={styles.inputlabel} htmlFor="#email">
        Email
      </label>
      <input
        id="email"
        type={"email"}
        value={email}
        className={styles.textfield}
        placeholder="E-Mail"
        disabled
      />
      <label className={styles.inputlabel} htmlFor="#password">
        Passwort
      </label>
      <input
        id="password"
        type={"password"}
        className={styles.textfield}
        value={password}
        onChange={(event) => setPassword(event.currentTarget.value)}
        placeholder="Passwort"
        autoFocus
      />
      <Link className={`${styles.darktext} ${styles.sm}`} href={`forgot-password?email=${email}`}>Password vergessen?</Link>
      <br />
      <span className={styles.buttonWrapper}>
        <button className={styles.secondary} type="button" onClick={() => router.push("/auth")}>E-Mail ändern</button>
        <button type={"submit"}>Login</button>
      </span>

    </form>
  )
}

export default Login

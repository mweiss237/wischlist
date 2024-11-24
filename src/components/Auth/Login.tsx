"use client"

import Link from "next/link"
import React, { FormEvent, useEffect, useState } from "react"
import styles from "./Auth.module.scss"
import Loading from "components/Loading/Loading"
import { useAuth, useUser } from "lib/auth"
import { useRouter, useSearchParams } from "next/navigation"

const Login = () => {
  const { user } = useUser()
  const { login, sendLoginLink, signInWithLink, checkLoginLink } = useAuth()
  const router = useRouter()
  const { get } = useSearchParams()

  const [loading, setLoading] = useState(false)
  const email = get("email") || ""
  const [password, setPassword] = React.useState("")
  const [loginMethod, setLoginMethod] = React.useState<"pending" | "password" | "link">("pending")


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
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleLoginWithLink = async () => {
    try {
      setLoginMethod("link")
      await sendLoginLink(email, window.location.href)
    } catch (error) {
      if (typeof error === "object" && error && "code" in error) {
        if (error.code === "auth/quota-exceeded") {
          alert("Hoppla, ohne Passwort anmelden geht gerade nicht. Bitte melde dich mit deinem Passwort an oder versuchs später nochmal.")
          setLoginMethod("password")
          return
        }
      }
      console.warn(error)
      alert("Hoppla, da lief etwas schief. Versuch's bitte nochmal.")
      setLoginMethod("pending")
    }
  }


  useEffect(() => {
    if (!checkLoginLink()) return

    setLoading(true)
    signInWithLink(email).finally(() => setLoading(false))
  }, [email, checkLoginLink, signInWithLink])

  useEffect(() => {
    if (user) router.push("/profile")
  }, [router, user])

  if (!email) return router.push("/auth")

  if (loading) return <Loading />



  return (
    <form onSubmit={handleLogin} className={`${styles.wrapper} ${styles.darktext}`}>
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
      {loginMethod === "pending" &&
        <div className={styles.loginMethods}>
          <button onClick={() => setLoginMethod("password")}>Passwort eingeben</button>
          <span> oder </span>
          <button onClick={handleLoginWithLink}>Ohne Passwort anmelden</button>
        </div>}
      {loginMethod === "password" && <>
        <label className={styles.inputlabel} htmlFor="#current-password">
          Passwort
        </label>
        <input
          id="current-password"
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
      </>}
      {loginMethod === "link" && <>
        <p>Prüfe dein E-Mail Postfach!</p>
      </>}
    </form>
  )
}

export default Login

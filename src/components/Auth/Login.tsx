"use client"

import Link from "next/link"
import React, { FormEvent, useEffect, useState } from "react"
import styles from "./Auth.module.scss"
import Loading from "components/Loading/Loading"
import { useDialog } from "components/Dialog/Dialog"
import { useAuth, useUser } from "lib/auth"
import { useRouter } from "next/navigation"

const Login = ({
  searchParams,
}: {
  searchParams: { email?: string }
}) => {
  const { user } = useUser()
  const { login, sendLoginLink, signInWithLink, checkLoginLink } = useAuth()
  const router = useRouter()
  const { email: initialEmail = "" } = searchParams
  const dialog = useDialog()

  const [loading, setLoading] = useState(false)
  const email = initialEmail
  const [password, setPassword] = React.useState("")
  const [loginMethod, setLoginMethod] = React.useState<
    "pending" | "password" | "link"
  >("pending")

  const handleLogin = async (e: FormEvent) => {
    setLoading(true)

    e.preventDefault()

    if (!email || !password) return

    try {
      await login(email, password)
    } catch (e) {
      dialog.alert("Überprüfe deine E-Mail oder dein Passwort.", {
        title: "Anmeldung fehlgeschlagen",
      })
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
          dialog.alert(
            "Ohne Passwort anmelden geht gerade nicht. Bitte melde dich mit deinem Passwort an oder versuchs später nochmal.",
            { title: "Hoppla" }
          )
          setLoginMethod("password")
          return
        }
      }
      console.warn(error)
      dialog.alert("Da lief etwas schief. Versuch's bitte nochmal.", {
        title: "Hoppla",
      })
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

  if (!email) router.push("/auth")

  if (loading) return <Loading />

  return (
    <form
      onSubmit={handleLogin}
      className={`${styles.wrapper} ${styles.darktext}`}
    >
      <div className={styles.heading}>
        <h1>Anmelden</h1>
        <p>Wie möchtest du dich anmelden?</p>
      </div>
      <label className={styles.inputlabel} htmlFor="email">
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
      {loginMethod === "pending" && (
        <div className={styles.loginMethods}>
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={() => setLoginMethod("password")}
          >
            Passwort eingeben
          </button>
          <span className={styles.divider}>oder</span>
          <button
            type="button"
            className="btn btn-ghost btn-lg"
            onClick={handleLoginWithLink}
          >
            Link per E-Mail erhalten
          </button>
        </div>
      )}
      {loginMethod === "password" && (
        <>
          <label className={styles.inputlabel} htmlFor="current-password">
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
          <Link
            className={`${styles.darktext} ${styles.sm}`}
            href={`forgot-password?email=${email}`}
          >
            Passwort vergessen?
          </Link>
          <span className={styles.buttonWrapper}>
            <button
              className="btn btn-ghost"
              type="button"
              onClick={() => router.push("/auth")}
            >
              E-Mail ändern
            </button>
            <button className="btn btn-primary" type={"submit"}>
              Anmelden
            </button>
          </span>
        </>
      )}
      {loginMethod === "link" && (
        <>
          <p className={styles.notice}>Prüfe dein E-Mail-Postfach!</p>
        </>
      )}
    </form>
  )
}

export default Login

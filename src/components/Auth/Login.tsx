"use client"

import Link from "next/link"
import React, { FormEvent, useEffect, useState } from "react"
import styles from "./Auth.module.scss"
import Loading from "components/Loading/Loading"
import { useAuth, useUser } from "lib/auth"
import { useRouter } from "next/navigation"

const Login = () => {
  const { user } = useUser()
  const { login } = useAuth()
  const router = useRouter()
  const emailRef = React.useRef<HTMLInputElement>(null)
  const passwordRef = React.useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: FormEvent) => {
    setLoading(true)

    e.preventDefault()
    const email = emailRef.current?.value
    const password = passwordRef.current?.value
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
        className={styles.textfield}
        ref={emailRef}
        placeholder="Email"
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
      />
      <Link className={`${styles.darktext} ${styles.sm}`} href={"/forgot-password"}>Password vergessen?</Link>
      <br />
      <span className={styles.buttonWrapper}>
        <button type={"submit"}>Login</button>
        <button type={"reset"}>Zurücksetzen</button>
      </span>

      <br />
      <p className={styles.darktext}>
        Noch kein Account? <Link href={`/register`}>Hier registrieren</Link>
      </p>
    </form>
  )
}

export default Login

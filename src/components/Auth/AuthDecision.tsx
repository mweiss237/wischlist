"use client"

import { useAuth, useUser } from "lib/auth"
import { useRouter } from "next/navigation"
import React, { use, FormEvent, useState, useEffect } from "react"
import styles from "./Auth.module.scss"

const AuthDecision = ({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>
}) => {
  const { checkUserExists } = useAuth()
  const { user } = useUser()
  const router = useRouter()

  const { email: initialEmail = "" } = use(searchParams)
  const [email, setEmail] = React.useState(initialEmail)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) router.push("/profile")
  }, [user, router])

  const authorize = async (e: FormEvent) => {
    setLoading(true)
    e.preventDefault()
    if (!email) return

    const result = await checkUserExists(email)

    setLoading(false)

    if (result.length != 0) return router.push(`login?email=${email}`)

    router.push(`register?email=${email}`)
  }

  return (
    <form className={styles.wrapper} onSubmit={authorize}>
      <div className={styles.heading}>
        <h1>Anmelden oder registrieren</h1>
        <p>
          Gib deine E-Mail ein – wir finden heraus, ob du schon ein Konto hast.
        </p>
      </div>
      <label className={styles.inputlabel} htmlFor="email">
        E-Mail
      </label>
      <input
        id="email"
        type={"email"}
        className={styles.textfield}
        value={email}
        onChange={(event) => setEmail(event.currentTarget.value)}
        placeholder="E-Mail"
        disabled={loading}
      />
      <span className={styles.buttonWrapper}>
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={!email || loading}
        >
          Weiter
        </button>
      </span>
    </form>
  )
}

export default AuthDecision

"use client"

import { useAuth, useUser } from "lib/auth"
import { useRouter, useSearchParams } from "next/navigation"
import React, { FormEvent, useState, useEffect } from "react"
import styles from "./Auth.module.scss"

const AuthDecision = () => {
    
    const { checkUserExists } = useAuth()
    const { user } = useUser()
    const router = useRouter()
    const { get } = useSearchParams()
    
    const [email, setEmail] = React.useState(get("email") || "")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (user) router.push("/profile")
    }, [user])

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
        <form className={styles.wrapper}>
            <label className={styles.inputlabel} htmlFor="#email">
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
                <button type="button" onClick={authorize} disabled={!email || loading}>Weiter</button>
            </span>
        </form>
    )
}

export default AuthDecision

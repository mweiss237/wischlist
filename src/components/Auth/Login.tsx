"use client"
import crypto from "crypto"
import React, { FormEvent } from "react"
import styles from "./Login.module.scss"

const Login = () => {
  const emailRef = React.useRef<HTMLInputElement>(null)
  const passwordRef = React.useRef<HTMLInputElement>(null)

  const login = async (e: FormEvent) => {
    e.preventDefault()
    const email = emailRef.current?.value
    const password = passwordRef.current?.value
    if (!email || !password) return

    const hash = crypto.createHash("md5").update(password).digest("hex")

    const result = await fetch("/api/user/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: email,
        passwordHash: hash,
      }),
    })

    alert(JSON.stringify(result))

    /* --- only with firebase-admin change which breaks currently ---*/
    // if ((await userDB.where("email", "==", email)).length > 0) {
    //   alert(`Email ${email} bereits registriert.`);
    //   return;
    // }

    // await userDB
    //   .add({
    //     email: emailRef.current.value,
    //     passwordHash: hash,
    //     lastLogin: new Date(),
    //   })
    // .then((result) => alert(`id ${result.id} added`));
  }

  return (
    <form onSubmit={login} className={styles.wrapper}>
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
      <span className={styles.buttonWrapper}>
        <button type={"submit"}>Login</button>
        <button type={"reset"}>Zurücksetzen</button>
      </span>
    </form>
  )
}

export default Login

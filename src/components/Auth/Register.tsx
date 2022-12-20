"use client"
import crypto from "crypto"
import { register } from "lib/client/authClient"
import Link from "next/link"
import React, { FormEvent } from "react"
import styles from "./Auth.module.scss"

const Register = () => {
  const emailRef = React.useRef<HTMLInputElement>(null)
  const usernameRef = React.useRef<HTMLInputElement>(null)
  const passwordRef = React.useRef<HTMLInputElement>(null)

  const authorize = async (e: FormEvent) => {
    e.preventDefault()
    const email = emailRef.current?.value
    const username = usernameRef.current?.value
    const password = passwordRef.current?.value
    if (!email || !username || !password) return

    const hash = crypto.createHash("md5").update(password).digest("hex")

    const registerResponse = await register({
      email,
      username,
      passwordHash: hash,
    })

    alert(JSON.stringify(registerResponse))
    /* --- only with firebase-admin change which breaks currently ---*/
    // if ((await userDB.where("email", "==", email)).length > 0) {
    //   alert(`Email ${email} bereits registriert.`);
    //   return;
    // }

    // alert("TODO!")
    // await userDB
    //   .add({
    //     email: emailRef.current.value,
    //     passwordHash: hash,
    //     username: username,
    //     lastLogin: new Date(),
    //   })
    //   .then((result) => alert(`id ${result.id} added`));
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
        <button type={"submit"}>Registrieren</button>
        <button type={"reset"}>Zurücksetzen</button>
      </span>
      <br />
      <p className={styles.darktext}>
        Schon registriert? <Link href={`/login`}>Hier anmelden</Link>
      </p>
    </form>
  )
}

export default Register

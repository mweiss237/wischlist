"use client"

import React from "react"
import { ArrowRight } from "react-feather"
import styles from "./GiverIntro.module.scss"

interface GiverIntroProps {
  onSubmit: (name: string) => void
  onSkip: () => void
}

// first thing an anonymous giver sees: a big gift tag to sign, the list waits below
const GiverIntro = ({ onSubmit, onSkip }: GiverIntroProps) => {
  const [name, setName] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    // on touch devices the keyboard would cover the list
    if (window.matchMedia("(pointer: fine)").matches) inputRef.current?.focus()
  }, [])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (name.trim()) onSubmit(name.trim())
  }

  return (
    <section className={`${styles.intro} lay_in`} aria-labelledby="giver-intro-title">
      <div className={styles.tag}>
        <p className={styles.hello}>Schön, dass du da bist!</p>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label id="giver-intro-title" htmlFor="giver-intro-name" className={styles.question}>
            Wie heißt du?
          </label>
          <div className={styles.line}>
            <span className={styles.from} aria-hidden>Von:</span>
            <input
              ref={inputRef}
              id="giver-intro-name"
              type="text"
              className={`crit_textinput ${styles.input}`}
              placeholder="Dein Name"
              maxLength={100}
              autoComplete="name"
              aria-describedby="giver-intro-info"
              value={name}
              onChange={(event) => setName(event.currentTarget.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={!name.trim()}>
            Weiter <ArrowRight size={16} aria-hidden />
          </button>
        </form>
        <p id="giver-intro-info" className={styles.info}>
          Dann sehen andere Schenkende, was du besorgst, und nichts kommt doppelt.
        </p>
        <button type="button" className={`btn btn-tertiary ${styles.skip}`} onClick={onSkip}>
          Ohne Namen weiter
        </button>
      </div>
    </section>
  )
}

export default GiverIntro

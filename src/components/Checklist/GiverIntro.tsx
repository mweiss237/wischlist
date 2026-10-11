"use client"

import React from "react"
import { ArrowRight, ChevronDown } from "react-feather"
import styles from "./GiverIntro.module.scss"

interface GiverIntroProps {
  onSubmit: (name: string) => void
  onSkip: () => void
}

// first thing an anonymous giver sees, asks for a name but lets them skip right to the list
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
    <section className={`${styles.intro} paper rise_in`} aria-labelledby="giver-intro-title">
      <span className="eyebrow">Schön, dass du da bist!</span>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label id="giver-intro-title" htmlFor="giver-intro-name" className={styles.question}>
          Wie heißt du?
        </label>
        <div className={styles.row}>
          <input
            ref={inputRef}
            id="giver-intro-name"
            type="text"
            className={styles.input}
            placeholder="Dein Name"
            maxLength={100}
            autoComplete="name"
            aria-describedby="giver-intro-info"
            value={name}
            onChange={(event) => setName(event.currentTarget.value)}
          />
          <button type="submit" className="btn btn-primary" disabled={!name.trim()}>
            Weiter <ArrowRight size={16} aria-hidden />
          </button>
        </div>
      </form>
      <p id="giver-intro-info" className={styles.info}>
        Dann sehen andere Schenkende, was du besorgst, und nichts kommt doppelt.
      </p>
      <button type="button" className={styles.skip} onClick={onSkip}>
        Ohne Namen weiter
        <ChevronDown size={20} className={styles.arrow} aria-hidden />
      </button>
    </section>
  )
}

export default GiverIntro

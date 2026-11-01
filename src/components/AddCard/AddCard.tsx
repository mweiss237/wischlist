"use client"

import { useDialog } from "components/Dialog/Dialog"
import { useUser } from "lib/auth"
import Link from "next/link"
import React from "react"
import { Scissors, Search } from "react-feather"

import styles from "./AddCard.module.scss"

interface AddCardParams {
  callback: () => void
  // quiet second way in, e.g. browsing ideas instead of writing a wish
  secondaryHref?: string
  secondaryLabel?: string
}

// a cut line: a new note is made here
const AddCard = ({ callback, secondaryHref, secondaryLabel = "oder Ideen stöbern" }: AddCardParams) => {
  const { user, loading } = useUser()
  const dialog = useDialog()
  const addEmptyCard = () => {
    if (!loading && !user) {
      dialog.alert("Bitte melde dich an, um Wünsche hinzuzufügen.", { title: "Nicht angemeldet" })
      return
    }
    callback()
  }
  const button = (
    <button
      className={`${styles["add-note"]}`}
      type="button"
      onClick={addEmptyCard}
    >
      <Scissors size={20} className={styles.scissors} aria-hidden />
      Neuer Wunsch
    </button>
  )

  if (!secondaryHref) return button

  // the link is a sibling of the button, buttons must not contain links
  return (
    <div className={styles.wrapper}>
      {button}
      <Link href={secondaryHref} className={styles.secondary}>
        <Search size={14} aria-hidden />
        {secondaryLabel}
      </Link>
    </div>
  )
}

export default AddCard

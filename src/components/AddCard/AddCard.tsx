"use client"

import { useDialog } from "components/Dialog/Dialog"
import { useUser } from "lib/auth"
import React from "react"
import { Scissors } from "react-feather"

import styles from "./AddCard.module.scss"

interface AddCardParams {
  callback: () => void
}

// a cut line: a new note is made here
const AddCard = ({ callback }: AddCardParams) => {
  const { user, loading } = useUser()
  const dialog = useDialog()
  const addEmptyCard = () => {
    if (!loading && !user) {
      dialog.alert("Bitte melde dich an, um Wünsche hinzuzufügen.", { title: "Nicht angemeldet" })
      return
    }
    callback()
  }
  return (
    <button
      className={`${styles["add-note"]}`}
      type="button"
      onClick={addEmptyCard}
    >
      <Scissors size={20} className={styles.scissors} aria-hidden />
      Neuer Wunsch
    </button>
  )
}

export default AddCard

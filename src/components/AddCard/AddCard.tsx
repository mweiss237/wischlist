"use client"

import { useUser } from "lib/auth"
import React from "react"
import { Plus } from "react-feather"

import styles from "./AddCard.module.scss"

interface AddCardParams {
  callback: () => void
}

const AddCard = ({ callback }: AddCardParams) => {
  const { user, loading } = useUser()
  const addEmptyCard = () => {
    if (!loading && !user) {
      alert("Bitte einloggen!")
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
      <span className={styles.icon}>
        <Plus size={22} aria-hidden />
      </span>
      Wunsch hinzufügen
    </button>
  )
}

export default AddCard

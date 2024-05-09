"use client"

import { useUser } from "lib/auth"
import React from "react"

import styles from "./AddCard.module.scss"

interface AddCardParams {
  callback: (value: Omit<any, "id">) => void
}

const AddCard = ({ callback }: AddCardParams) => {
  const { user, loading } = useUser()
  const [isLoading, setLoading] = React.useState(false)
  const addEmptyCard = () => {
    setLoading(true)
    if (!loading && !user) {
      alert("Bitte einloggen!")
      setLoading(false)
      return
    }
    callback({ wish: "" })
  }
  return (
    <button
      className={`${styles["add-note"]}`}
      disabled={isLoading}
      type="button"
      onClick={addEmptyCard}
    >
      +
    </button>
  )
}

export default AddCard

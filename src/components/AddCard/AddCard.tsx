"use client"

import useUser from "lib/user"
import React from "react"
import { Wish } from "types/Wish"
import styles from "./AddCard.module.scss"

interface AddCardParams {
  callback: (value: Omit<Wish, "id">) => void
}

const AddCard = ({ callback }: AddCardParams) => {
  const { user } = useUser()
  const [isLoading, setLoading] = React.useState(false)
  const addEmptyCard = () => {
    setLoading(true)
    if (user?.isLoggedIn === false || !user?.id) {
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

"use client"

import { wishClient } from "lib/client/wishClient"
import useUser from "lib/hooks/useUser"
import React from "react"
import { Wish } from "types/Wish"
import styles from "./AddCard.module.scss"

interface AddCardParams {
  callback: (value: Wish) => void
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

    wishClient
      .add({ wish: "" })
      .then((value) => {
        callback(value.result)
      })
      .finally(() => setLoading(false))
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

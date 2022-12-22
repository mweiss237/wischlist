"use client"
import AddCard from "components/AddCard/AddCard"
import Card from "components/Card/Card"
import { wishClient } from "lib/client/wishClient"
import useUser from "lib/hooks/useUser"
import Link from "next/link"
import React from "react"
import { useState } from "react"
import { Wish } from "types/Wish"
import styles from "./List.module.scss"

const List = () => {
  const { user } = useUser()
  const [wishes, setWishes] = useState<Wish[]>([])
  React.useEffect(() => {
    wishClient.get().then((response) => {
      if (response?.success) setWishes(response.result)
      else console.warn(response.message)
    })
  }, [])

  const addCallback = (wish: Wish) => setWishes([...wishes, wish])
  const deleteCallback = (id: string) => {
    setWishes(wishes.filter((wish) => wish.id !== id))
  }
  const changeCallback = (id: string, value: string) => {
    setWishes(
      wishes.map((entry) => {
        if (entry.id === id) entry.wish = value
        return entry
      })
    )
  }

  return (
    <div className={styles.list}>
      {user?.isLoggedIn ? (
        <>
          {wishes.map((wish) => (
            <Card
              key={`wish_${wish.id}`}
              id={wish.id}
              value={wish.wish}
              onDelete={deleteCallback}
              onChange={changeCallback}
            />
          ))}
          <AddCard callback={addCallback} />
        </>
      ) : (
        <p>
          <Link href="/login">Logge dich ein</Link>, um deine Liste sehen zu
          können.
        </p>
      )}
    </div>
  )
}

export default List

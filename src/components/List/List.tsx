"use client"
import AddCard from "components/AddCard/AddCard"
import Card from "components/Card/Card"
import Loading from "components/Loading/Loading"
import { useAuth } from "lib/auth"


import Link from "next/link"
import React from "react"
import { useState } from "react"
import styles from "./List.module.scss"

const List = ({ params }: { params: { listId: string } }) => {
  const { user, loading } = useAuth()


  const [wishes, setWishes] = useState<any[]>([])

  if (loading) return <Loading />


  // React.useEffect(() => {
  //   setLoading(true)
  //   wishClient
  //     .get()
  //     .then((response) => {
  //       if (response?.success) {
  //         setWishes(response.result)
  //       } else console.warn(response.message)
  //     })
  //     .finally(() => setLoading(false))
  // }, [])

  // const addCallback = (newWish: Omit<Wish, "id">) => {
  //   wishClient
  //     .add(newWish)
  //     .then((value) => setWishes([...wishes, value.result]))
  // }
  // const deleteCallback = (id: string) => {
  //   wishClient.delete(id).then((response) => {
  //     if (!response.success) return alert(`FEHLER: ${response.message}`)
  //     setWishes(wishes.filter((wish) => wish.id !== id))
  //   })
  // }
  // const saveCallback = (id: string, value: string) => {
  //   wishClient.update(id, { wish: value }).then((response) => {
  //     if (!response.success) return alert(`FEHLER: ${response.message}`)
  //     console.log(`entry ${id} saved`)
  //   })
  // }
  // const changeCallback = (id: string, value: string) => {
  //   setWishes(
  //     wishes.map((entry) => {
  //       if (entry.id === id) entry.wish = value
  //       return entry
  //     })
  //   )
  // }

  return (
    <div className={styles.list}>
      {user ? (
        <>
          {wishes.map((wish) => (
            <Card
              key={`wish_${wish.id}`}
              id={wish.id}
              value={wish.wish}
              onDelete={() => { return }}
              onChange={() => { return }}
              onSave={() => { return }}
            />
          ))}
          <AddCard callback={() => { return }} />
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

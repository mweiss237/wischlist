"use client"
import AddCard from "components/AddCard/AddCard"
import Card from "components/Card/Card"
import Loading from "components/Loading/Loading"
import { ClientHelper } from "lib/client/ClientHelper"
import { useLists } from "lib/hooks/useLists"
import useUser from "lib/hooks/useUser"
import Link from "next/link"
import React from "react"
import { useState } from "react"
import { UserList } from "types"
import { Wish } from "types/Wish"
import styles from "./ListOverview.module.scss"

const ListOverview = () => {
  const { user, mutateUser } = useUser({
    redirectTo: "/login",
    redirectIfFound: false,
  })
  const [isLoading, setLoading] = useState(false)
  const { lists, mutateLists } = useLists(user?.id || "")

  //   const listClient = new ClientHelper<UserList>(`/api/lists`)

  //   React.useEffect(() => {
  //     setLoading(true)
  //     listClient
  //       .get()
  //       .then((response) => {
  //         if (response?.success) setWishes(response.result)
  //         else console.warn(response.message)
  //       })
  //       .finally(() => setLoading(false))
  //   }, [])

  if (!user) {
    return <p>Not logged in. Redirecting...</p>
  }

  //   const addCallback = (wish: Wish) => setWishes([...wishes, wish])
  //   const deleteCallback = (id: string) => {
  //     setWishes(wishes.filter((wish) => wish.id !== id))
  //   }
  //   const changeCallback = (id: string, value: string) => {
  //     setWishes(
  //       wishes.map((entry) => {
  //         if (entry.id === id) entry.wish = value
  //         return entry
  //       })
  //     )
  //   }

  return (
    <div className={styles.list}>
      {isLoading ? (
        <Loading />
      ) : user?.isLoggedIn ? (
        <>
          {lists?.map((list) => (
            <a
              className={styles.listLink}
              href={`/list/${list.id}`}
              key={`list_${list.id}`}
              id={list.id}
            >
              {list.title}
            </a>
          ))}
          {/* <AddCard callback={addCallback} /> */}
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

export default ListOverview

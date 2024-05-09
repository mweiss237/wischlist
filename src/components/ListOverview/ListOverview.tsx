"use client"
import Loading from "components/Loading/Loading"
import { useUser } from "lib/auth"
import { useLists } from "lib/lists"


import Link from "next/link"
import React from "react"
import styles from "./ListOverview.module.scss"

const ListOverview = () => {
  const { user, loading } = useUser()


  const { lists, addList } = useLists()


  if (loading) return <Loading />

  if (!user) {
    return <p>Not logged in. Please login first!</p>
  }

  const handleAddList = async () => {
    const listName = prompt("Bitte listennamen eingeben:", "neue Liste")
    if (listName)
      addList(listName)
  }

  if (loading) return <Loading />

  return (
    <div className={styles.list}>
      {user ? (
        <>
          <div>
            {lists && Object.keys(lists)?.map((listId) => {
              const list = lists[listId]
              return (
                <Link
                  className={styles.listLink}
                  href={`/list/${listId}`}
                  key={`list_${listId}`}
                  id={listId}
                >
                  {list.title}
                </Link>
              )
            })}
          </div>
          <button className={styles.addEntry} onClick={handleAddList}>
            <span>+</span>
          </button>
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

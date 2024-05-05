"use client"
import Loading from "components/Loading/Loading"
import { useAuth } from "lib/auth"


import Link from "next/link"
import React from "react"
import { useState } from "react"
import { List } from "types"
import styles from "./ListOverview.module.scss"

const ListOverview = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  const LISTS: List[] = []


  if (!user) {
    return <p>Not logged in. Please login first!</p>
  }

  const handleAddList = async () => {
    return alert("not yet!")
  }

  if (loading) return <Loading />

  return (
    <div className={styles.list}>
      {user ? (
        <>
          <div>
            {LISTS.map((list) => (
              <a
                className={styles.listLink}
                href={`/list/${list.id}`}
                key={`list_${list.id}`}
                id={list.id}
              >
                {list.title}
              </a>
            ))}
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

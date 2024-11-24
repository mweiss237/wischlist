"use client"

import { useUser } from "lib/auth"
import { useFavorites } from "lib/favorite"
import Link from "next/link"
import React from "react"
import styles from "./ListFavorites.module.scss"

const ListFavorites = () => {
  const { user } = useUser()
  const { favorites } = useFavorites()

  return (
    user ? (
      <div className={styles.list}>
        {Object.entries(favorites || {}).map(([listId, favorite], index) =>
          <Link key={index} href={`/list/${listId}/share`} className={styles.addEntry}>
            <p>{favorite.title}</p>
          </Link>
        )}
      </div>) : (

      <p>
        <Link href="/auth">Logge dich ein</Link>, um deine Favoriten sehen zu können.
      </p>

    )
  )
}

export default ListFavorites

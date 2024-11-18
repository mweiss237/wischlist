"use client"

import { useFavorites } from "lib/favorite"
import Link from "next/link"
import React from "react"
import styles from "./ListFavorites.module.scss"

const ListFavorites = () => {
  const { favorites } = useFavorites()

  return (
    <div className={styles.list}>
      {Object.entries(favorites || {}).map(([listId, favorite], index) =>
        <Link key={index} href={`/list/${listId}/share`} className={styles.addEntry}>
          <p>{favorite.title}</p>
        </Link>
      )}
    </div >
  )
}

export default ListFavorites

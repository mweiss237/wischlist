"use client"
import { useFavorites } from "lib/favorite"


import Link from "next/link"
import React from "react"
import styles from "./ListFavorites.module.scss"

const ListFavorites = () => {
  const { favorites } = useFavorites()


  return (
    <div className={styles.list}>
      {favorites.map(favorite =>
        <Link href={`/list/${favorite.listId}/share`} className={styles.addEntry}>
          <p>{favorite.title || favorite.listId}</p>
        </Link>
      )}
    </div >
  )
}

export default ListFavorites

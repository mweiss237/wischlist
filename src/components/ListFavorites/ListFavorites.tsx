"use client"

import { useUser } from "lib/auth"
import { useFavorites } from "lib/favorite"
import Link from "next/link"
import React from "react"
import styles from "./ListFavorites.module.scss"

const ListFavorites = () => {
  const { user } = useUser()
  const { favorites } = useFavorites()

  const computeAccent = (id: string) => {
    let h = 0
    for (let i = 0; i < id.length; i++) {
      h = (h * 31 + id.charCodeAt(i)) % 360
    }
    return `hsl(${h}, 65%, 55%)`
  }

  if (!user) {
    return (
      <p>
        <Link href="/auth">Logge dich ein</Link>, um deine Favoriten sehen zu können.
      </p>
    )
  }

  return (
    <div className={styles.list}>
      <div className={styles.grid}>
        {Object.keys(favorites || {}).map((listId) => {
          const favorite = (favorites || {})[listId]
          const accent = computeAccent(listId)
          const style = { ['--accent' as any]: accent } as React.CSSProperties

          return (
            <Link
              href={`/list/${listId}/share`}
              key={listId}
              id={listId}
              className={styles.card}
              style={style}
            >
              <div className={styles.cardHeader} aria-hidden>
                <div className={styles.emoji}>⭐</div>
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.title}>{favorite?.title || 'Unnamed'}</h3>
                <div className={styles.meta}>
                  <span className={styles.badge}>Favorit</span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default ListFavorites

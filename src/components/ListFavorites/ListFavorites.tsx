"use client"

import { ListCard } from "components/ListCard/ListCard"
import cardStyles from "components/ListCard/ListCard.module.scss"
import { useUser } from "lib/auth"
import { useFavorites } from "lib/favorite"
import Link from "next/link"
import { Star } from "react-feather"

const ListFavorites = () => {
  const { user } = useUser()
  const { favorites } = useFavorites()

  if (!user) {
    return (
      <div className="empty_state paper">
        <span className="eyebrow">Gemerkt</span>
        <h2>Deine Favoriten</h2>
        <p>Melde dich an, um die Listen anderer zu merken und schnell wiederzufinden.</p>
        <Link href="/auth" className="btn btn-primary">Anmelden</Link>
      </div>
    )
  }

  const favoriteEntries = Object.entries(favorites || {})

  return (
    <>
      <header className="page_header">
        <span className="eyebrow">Gemerkt</span>
        <h1>Favoriten</h1>
        <p>Wunschlisten von Familie und Freunden, die du dir mit dem Stern gemerkt hast.</p>
      </header>

      {favoriteEntries.length ? (
        <div className={cardStyles.grid}>
          {favoriteEntries.map(([listId, favorite]) => (
            <ListCard
              key={listId}
              id={listId}
              href={`/list/${listId}/share`}
              title={favorite?.title}
              badge="Favorit"
              variant="favorite"
            />
          ))}
        </div>
      ) : (
        <div className="empty_state paper">
          <Star size={28} style={{ color: "var(--gold)" }} aria-hidden />
          <h2>Noch keine Favoriten</h2>
          <p>Öffne eine geteilte Liste und tippe auf den Stern, um sie hier zu sammeln.</p>
        </div>
      )}
    </>
  )
}

export default ListFavorites

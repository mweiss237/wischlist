"use client"

import EmptyState from "components/EmptyState/EmptyState"
import { ListCard } from "components/ListCard/ListCard"
import cardStyles from "components/ListCard/ListCard.module.scss"
import { useUser } from "lib/auth"
import { useFavorites } from "lib/favorite"
import Link from "next/link"

const ListFavorites = () => {
  const { user } = useUser()
  const { favorites } = useFavorites()

  if (!user) {
    return (
      <>
        <header className="page_header">
          <h1>Favoriten</h1>
        </header>
        <EmptyState
          text="Melde dich an, um dir die Listen anderer zu merken."
          action={<Link href="/auth" className="btn btn-primary">Anmelden</Link>}
        />
      </>
    )
  }

  const favoriteEntries = Object.entries(favorites || {})

  return (
    <>
      <header className="page_header">
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
              status="favorite"
            />
          ))}
        </div>
      ) : (
        <EmptyState text="Noch nichts gemerkt. Tipp in einer geteilten Liste auf den Stern, dann landet sie hier." />
      )}
    </>
  )
}

export default ListFavorites

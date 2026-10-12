"use client"
import Loading from "components/Loading/Loading"
import EmptyState from "components/EmptyState/EmptyState"
import { AddListCard, ListCard } from "components/ListCard/ListCard"
import cardStyles from "components/ListCard/ListCard.module.scss"
import { useUser } from "lib/auth"
import { useLists } from "lib/lists"
import Link from "next/link"
import { useState } from "react"
import { Plus } from "react-feather"

const ListOverview = () => {
  const { user, loading } = useUser()
  const { lists, addList } = useLists()
  const [isCreating, setCreating] = useState(false)

  if (loading) return <Loading />

  const handleAddList = (listName: string) => {
    addList(listName)
    setCreating(false)
  }

  if (!user) {
    return (
      <>
        <header className="page_header">
          <h1>Meine Listen</h1>
        </header>
        <EmptyState
          text="Melde dich an, dann warten hier deine Wunschlisten."
          action={<Link href="/auth" className="btn btn-primary">Anmelden</Link>}
        />
      </>
    )
  }

  return (
    <>
      <header className="page_header page_header_row">
        <div>
          <h1>Meine Listen</h1>
          <p>Leg für jeden Anlass eine eigene Liste an und teile sie, wenn sie fertig ist.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setCreating(true)}>
          <Plus size={18} aria-hidden /> Neue Liste
        </button>
      </header>

      <div className={cardStyles.grid}>
        {Object.entries(lists || {}).map(([listId, list]) => (
          <ListCard
            key={`list_${listId}`}
            id={listId}
            href={`/list/${listId}`}
            title={list.title}
            status={list.options?.isShared ? "shared" : "private"}
            eventDate={list.eventDate}
          />
        ))}
        <AddListCard
          isCreating={isCreating}
          onOpen={() => setCreating(true)}
          onCreate={handleAddList}
          onCancel={() => setCreating(false)}
        />
      </div>
    </>
  )
}

export default ListOverview

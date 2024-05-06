"use client"
import AddCard from "components/AddCard/AddCard"
import Card from "components/Card/Card"
import Loading from "components/Loading/Loading"
import { useAuth } from "lib/auth"
import { useEntries } from "lib/entries"
import Image from "next/image"


import Link from "next/link"
import { usePathname } from "next/navigation"
import React from "react"
import { useState } from "react"
import styles from "./List.module.scss"

const List = ({ params }: { params: { listId: string } }) => {
  const { user, loading } = useAuth()
  const pathname = usePathname()
  const { listId } = params

  const { entries, addEntry, removeEntry, updateEntry } = useEntries(listId)

  if (loading) return <Loading />

  return (
    <div className={styles.list}>
      {user ? (
        <>
          <Link href={`${pathname}/share`} className={styles.share} title="Liste teilen">
            <Image 
              height={30}
              width={30}
              unoptimized
              loading="lazy"
              src={"/present.svg"}
              alt="Liste teilen" />
          </Link>
          {entries && Object.keys(entries).map((entryId) => {
            const entry = entries[entryId]
            return (
              <Card
                key={`wish_${entryId}`}
                id={entryId}
                value={entry.text}
                onDelete={() => removeEntry(entryId)}
                onSave={(_id, value) => { updateEntry(entryId, { text: value }) }}
              />
            )
          })}
          <AddCard callback={() => addEntry({
            text: "",
          })} />
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

export default List

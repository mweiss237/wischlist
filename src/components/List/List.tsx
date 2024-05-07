"use client"
import AddCard from "components/AddCard/AddCard"
import Card from "components/Card/Card"
import Loading from "components/Loading/Loading"
import { useAuth } from "lib/auth"
import { useEntries } from "lib/entries"



import Link from "next/link"
import React from "react"
import { useState } from "react"
import styles from "./List.module.scss"

const List = ({ params }: { params: { listId: string } }) => {
  const { user, loading } = useAuth()

  const { listId } = params

  const { entries, addEntry, removeEntry, updateEntry } = useEntries(listId)


  const [isClicked, setClicked] = useState(false)

  if (loading) return <Loading />

  const copyUrlToClipboard = () => {
    setClicked(true)
    navigator.clipboard.writeText(`${window.location.href}/share`)
  }


  return (
    <>
      {user ? (
        <>
          <div className={styles.shareWrapper}>
            <button className={`crit_button ${styles.share} ${isClicked && styles.clicked}`} onClick={copyUrlToClipboard}>Link {!isClicked ? "kopieren" : "kopiert!"}</button>
          </div>
          <div className={styles.list}>

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
          </div>
        </>
      ) : (
        <p>
          <Link href="/login">Logge dich ein</Link>, um deine Liste sehen zu
          können.
        </p>
      )}
    </>
  )
}

export default List

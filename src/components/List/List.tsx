"use client"
import { Indie_Flower } from "@next/font/google"
import AddCard from "components/AddCard/AddCard"
import Card from "components/Card/Card"
import { DeleteTrashCan } from "components/DeleteTrashCan/DeleteTrashCan"
import Loading from "components/Loading/Loading"
import { useUser } from "lib/auth"
import { useEntries } from "lib/entries"
import { useList } from "lib/list"


import Link from "next/link"
import { useRouter } from "next/navigation"
import React from "react"
import { useState, useCallback } from "react"
import styles from "./List.module.scss"

const indieFlowerFont = Indie_Flower({ weight: "400", subsets: ["latin"] })

const List = ({ params }: { params: { listId: string } }) => {
  const router = useRouter()
  const { user, loading } = useUser()

  const { listId } = params

  const { list, updateListTitle, deleteList } = useList(listId)
  const { entries, addEntry, removeEntry, updateEntry } = useEntries(listId)


  const [isClicked, setClicked] = useState(false)

  const handleDeleteList = useCallback(() => {
    if (confirm("Möchtest du diese Liste wirklich unwiederbringlich löschen?")) {
      deleteList()
      router.push("/list")
    }
  }, [deleteList])

  if (loading) return <Loading />

  const handleChangeListName = () => {
    const listName = prompt("Ändere den Namen für diese Liste", list?.title)

    if (listName === null) return

    if (listName === "") return alert("Bitte gib einen Namen ein!")

    updateListTitle(listName)
  }

  const copyUrlToClipboard = () => {
    setClicked(true)
    navigator.clipboard.writeText(`${window.location.href}/share`)
  }



  return (
    <>
      <DeleteTrashCan onDelete={handleDeleteList} />
      <div className={`${styles.listNameWrapper} ${indieFlowerFont.className}`}>

        <span>Liste:</span>
        <input onClick={handleChangeListName} type="text" readOnly value={list?.title} className={`${indieFlowerFont.className} crit_textinput`} />
      </div>
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
                  link={entry.link}
                  priority={entry.priority}
                  onDelete={() => removeEntry(entryId)}
                  onSave={(_id, value) => { updateEntry(entryId, { text: value }) }}
                  onAddLink={(value) => { updateEntry(entryId, { link: value }) }}
                  onSetPriority={(priority) => { updateEntry(entryId, { priority }) }}
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

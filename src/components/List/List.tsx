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
import Image from "next/image"
import { useRouter } from "next/navigation"
import React from "react"
import { useState, useCallback } from "react"
import styles from "./List.module.scss"

import PresentSVG from "../../../public/present.svg"

const indieFlowerFont = Indie_Flower({ weight: "400", subsets: ["latin"] })

const List = ({ params }: { params: { listId: string } }) => {
  const router = useRouter()
  const { user, loading } = useUser()

  const { listId } = params

  const { list, updateListTitle, deleteList } = useList(listId)
  const { entries, addEntry, removeEntry, updateEntry } = useEntries(listId)

  const alreadyPickedSome = React.useMemo(() =>
    Object.values(entries || {})
      .some(entry => entry.taken?.timestamp !== undefined)
    , [entries])

  const takenEntries = React.useMemo(() =>
    Object.values(entries || {})
      .filter(entry => entry.taken !== undefined && entry.taken.timestamp)
    , [entries])

  const [isClicked, setClicked] = useState(false)
  let canShare = false
  try {
    canShare = navigator.canShare()
  } catch (_) {
    console.log("WebShare api not available")
  }


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

  const shareOrCopyUrlToClipboard = () => {
    setClicked(true)

    canShare ? navigator.share({
      title: `Wischlist - ${list?.title} von ${user?.displayName}`,
      text: `Hey, ich möchte diese Wunschliste mit dir teilen!`,
      url: `${window.location.href}/share`
    }) : navigator.clipboard.writeText(`${window.location.href}/share`)




    setTimeout(() => setClicked(false), 2000)
  }



  return (
    <>
      {alreadyPickedSome ?
        <div className={`${indieFlowerFont.className} ${styles.pickedInfo} crit_centered`}>
          <PresentSVG color="#ffc107" />
          <p>
            Bereits {takenEntries.length} Wünsche reserviert!
          </p>
        </div>
        : null}
      <DeleteTrashCan onDelete={handleDeleteList} />
      <div className={`${styles.listNameWrapper} ${indieFlowerFont.className}`}>

        <span>Liste:</span>
        <input onClick={handleChangeListName} type="text" readOnly value={list?.title} className={`${indieFlowerFont.className} crit_textinput`} />
      </div>
      {
        user ? (
          <>
            <div className={styles.shareWrapper}>

              <input type="text" readOnly value={`${window.location.href}/share`} />
              <button
                title={canShare ? "Liste teilen" : "Link kopieren"}
                className={`crit_button ${styles.share} ${isClicked && styles.clicked}`}
                onClick={shareOrCopyUrlToClipboard}>
                <Image
                  src={canShare ? "/link.svg" : "/copy.svg"}
                  alt={canShare ? "Liste teilen" : "Link kopieren"}
                  height={20}
                  width={20}
                  unoptimized
                  loading="lazy"
                />
              </button>
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
        )
      }
    </>
  )
}

export default List

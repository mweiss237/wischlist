"use client"
import { Indie_Flower } from "next/font/google"
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
import { Priority } from "types"
import { DndContext, useSensors, DragEndEvent } from "@dnd-kit/core"
import { KeyboardSensor, PointerSensor, useSensor, closestCenter } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates } from "@dnd-kit/sortable"

const indieFlowerFont = Indie_Flower({ weight: "400", subsets: ["latin"] })

const List = ({ params }: { params: { listId: string } }) => {
  const router = useRouter()
  const { user, loading } = useUser()

  const { listId } = params

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );




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
  const [isShareAvailable, setShareAvailable] = useState(false)
  React.useEffect(() =>
    setShareAvailable(navigator?.share !== undefined)
    , [])


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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = sortedEntryArray.findIndex(([id]) => id === active.id);
      const newIndex = sortedEntryArray.findIndex(([id]) => id === over?.id);
      const movedEntry = sortedEntryArray.splice(oldIndex, 1)
      sortedEntryArray.splice(newIndex, 0, movedEntry[0])

      for (const index in sortedEntryArray) {
        updateEntry(sortedEntryArray[index][0], { position: +index })
      }
    }
  }

  const shareOrCopyUrlToClipboard = () => {
    setClicked(true)

    isShareAvailable ? navigator.share({
      title: `Wischlist - ${list?.title} von ${user?.displayName}`,
      text: `Hey, ich möchte diese Wunschliste mit dir teilen!`,
      url: `${window.location.href}/share`
    }) : navigator.clipboard.writeText(`${window.location.href}/share`)

    setTimeout(() => setClicked(false), 2000)
  }

  const sortedEntryArray = Object.entries(entries || {}).sort((a, b) => (a[1].position || 0) - (b[1].position || 0))

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
                title={isShareAvailable ? "Liste teilen" : "Link kopieren"}
                className={`crit_button ${styles.share} ${isClicked && styles.clicked}`}
                onClick={shareOrCopyUrlToClipboard}>
                <Image
                  src={isShareAvailable ? "/link.svg" : "/copy.svg"}
                  alt={isShareAvailable ? "Liste teilen" : "Link kopieren"}
                  height={20}
                  width={20}
                  unoptimized
                  loading="lazy"
                />
              </button>
            </div>

            <div id="list" className={styles.list}>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={sortedEntryArray.map(entry => entry[0])}
                >
                  {sortedEntryArray.map(([id, entry]) => (
                    <Card
                      key={`wish_${id}`}
                      id={id}
                      value={entry.text}
                      link={entry.link}
                      priority={entry.priority}
                      onDelete={() => removeEntry(id)}
                      onSave={(_id, value) => { updateEntry(id, { text: value }) }}
                      onAddLink={(value) => { updateEntry(id, { link: value }) }}
                      onSetPriority={(priority) => { updateEntry(id, { priority }) }}
                    />))}
                </SortableContext>
              </DndContext>

              <AddCard callback={() => addEntry({
                text: "",
                priority: Priority.medium,
                position: sortedEntryArray.length
              }).then(() => {
                const lastCard = document.querySelector<HTMLInputElement>("#list > :last-of-type textarea")
                lastCard?.focus();
              })} />
            </div>

            <div className="crit_centered">

              <p className={`${indieFlowerFont.className} ${styles.text_centered}`}>
                <i>
                  ℹ️<br />
                  Die Reihenfolge spiegelt die der teilbaren Liste ab.
                  Um sie zu änderen, selektiere und halte einen Eintrag.
                </i>
              </p>
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

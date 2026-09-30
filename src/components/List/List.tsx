"use client"
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

import { Priority } from "types"
import { DndContext, useSensors, DragEndEvent } from "@dnd-kit/core"
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  closestCenter,
} from "@dnd-kit/core"
import { SortableContext, sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { Calendar, Check, Copy, Eye, Gift, Link as FeatherLink, Move } from "react-feather"
import Checkbox from "./ListOptions"
import { describeCountdown, formatEventDate, todayIsoDate } from "lib/date"

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
  )

  const {
    list,
    updateListTitle,
    updateListEventDate,
    deleteList,
    updateListOptions,
  } = useList(listId)
  const {
    entries,
    addEntry,
    removeEntry,
    removeEntries,
    updateEntry,
    reorderEntries,
  } = useEntries(listId)

  const takenEntryIds = React.useMemo(
    () =>
      Object.entries(entries || {}).flatMap(([id, entry]) =>
        entry.taken?.timestamp ? [id] : []
      ),
    [entries]
  )
  const alreadyPickedSome = takenEntryIds.length > 0

  const [isClicked, setClicked] = useState(false)
  const [isShareAvailable, setShareAvailable] = useState(false)
  const [listName, setListName] = React.useState(list?.title)
  const [isListShared, setListShared] = React.useState(
    list?.options?.isShared || false
  )
  const [isListBlurry, setListBlurry] = React.useState(
    list?.options?.blurForOwner || false
  )

  React.useEffect(() => setShareAvailable(navigator?.share !== undefined), [])

  React.useEffect(() => {
    if (list) {
      setListName(list.title)
      setListShared(!!list.options?.isShared)
      setListBlurry(!!list.options?.blurForOwner)
    }
  }, [list, setListName, setListShared, setListBlurry])

  React.useEffect(() => {
    if (!loading && user !== null && list && user.uid !== list.userId) {
      alert("⛔ Diese Liste gehört einem anderen Account! ⛔")
      router.replace("/list")
    }
  }, [user, list, router, loading])

  const handleDeleteList = useCallback(() => {
    if (
      confirm("Möchtest du diese Liste wirklich unwiederbringlich löschen?")
    ) {
      deleteList()
        .then(() => router.replace("/list"))
        .catch((error) => {
          console.error("[rtdb] delete list", error)
          alert("Liste konnte nicht gelöscht werden.")
        })
    }
  }, [deleteList, router])

  if (
    loading ||
    (!loading && user !== null && list && user.uid !== list.userId)
  )
    return <Loading />

  const handleChangeListName: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => setListName(event.target.value)

  const handleBlurListName = () => updateListTitle(listName || "")

  const handleChangeEventDate: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => updateListEventDate(event.target.value || null)

  // only reveal which entries were taken once the occasion is over
  const isEventOver = !!list?.eventDate && list.eventDate < todayIsoDate()

  const handleRemoveTakenEntries = () => {
    if (
      confirm(
        `${takenEntryIds.length} reservierte Wünsche endgültig von der Liste entfernen?`
      )
    ) {
      removeEntries(takenEntryIds).catch((error) => {
        console.error("[rtdb] remove taken entries", error)
        alert("Reservierte Wünsche konnten nicht entfernt werden.")
      })
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = sortedEntryArray.findIndex(([id]) => id === active.id)
      const newIndex = sortedEntryArray.findIndex(([id]) => id === over?.id)
      const orderedIds = sortedEntryArray.map(([id]) => id)
      const [movedId] = orderedIds.splice(oldIndex, 1)
      orderedIds.splice(newIndex, 0, movedId)

      reorderEntries(orderedIds)
    }
  }

  const shareOrCopyUrlToClipboard = () => {
    setClicked(true)

    isShareAvailable
      ? navigator.share({
          title: `Wischlist`,
          text: `Wunschliste "${list?.title} von ${user?.displayName}"`,
          url: `${window.location.href}/share`,
        })
      : navigator.clipboard.writeText(`${window.location.href}/share`)

    setTimeout(() => setClicked(false), 2000)
  }

  const sortedEntryArray = Object.entries(entries || {}).sort(
    (a, b) => (a[1].position || 0) - (b[1].position || 0)
  )

  const shareUrl = `${window.location.href}/share`
  const wishCount = sortedEntryArray.length

  return (
    <>
      <header className={`page_header ${styles.header}`}>
        <div className={styles.titleBlock}>
          <span className="eyebrow">Wunschliste</span>
          <label className="sr_only" htmlFor="list-title">Name der Liste</label>
          <input
            id="list-title"
            onChange={handleChangeListName}
            onBlur={handleBlurListName}
            type="text"
            value={listName || ""}
            placeholder="Name der Liste"
            className={styles.titleInput}
          />
          <div className={styles.meta}>
            <span className="chip">
              {wishCount} {wishCount === 1 ? "Wunsch" : "Wünsche"}
            </span>
            <span className={`chip ${isListShared ? "chip-green" : ""}`}>
              {isListShared ? "Geteilt" : "Entwurf"}
            </span>
            {list?.eventDate ? (
              <span className="chip chip-gold">
                <Calendar size={12} aria-hidden /> {formatEventDate(list.eventDate)} · {describeCountdown(list.eventDate)}
              </span>
            ) : null}
          </div>
        </div>
        {user ? (
          <div className={styles.headerActions}>
            {isListShared ? (
              <Link href={`/list/${listId}/share`} className="btn btn-ghost">
                <Eye size={18} aria-hidden /> Vorschau
              </Link>
            ) : null}
            <DeleteTrashCan onDelete={handleDeleteList} />
          </div>
        ) : null}
      </header>

      {user ? (
        <>
          {alreadyPickedSome ? (
            <div className={styles.pickedInfo}>
              <span className={styles.pickedIcon}>
                <Gift size={20} aria-hidden />
              </span>
              <p>
                <b>
                  Bereits {takenEntryIds.length}{" "}
                  {takenEntryIds.length === 1 ? "Wunsch" : "Wünsche"} reserviert!
                </b>
                <span>Wer was schenkt, bleibt natürlich geheim.</span>
              </p>
              {isEventOver ? (
                <button className="btn btn-ghost btn-sm" onClick={handleRemoveTakenEntries}>
                  Reservierte entfernen
                </button>
              ) : null}
            </div>
          ) : null}

          <div className={styles.layout}>
            <aside className={`${styles.settings} paper`}>
              <h2 className={styles.settingsTitle}>Einstellungen</h2>
              {/* TODO: checkbox states are not reflected the right way */}
              <Checkbox
                checked={isListShared}
                label="Liste teilen"
                description="Jeder mit dem Link kann Wünsche reservieren."
                onToggle={() => {
                  setListShared((state) => !state)
                  updateListOptions({ isShared: !isListShared })
                }}
              />
              <Checkbox
                disabled={!isListShared}
                checked={isListBlurry}
                label="Für mich unkenntlich"
                description="Verschwommen, sobald etwas reserviert ist."
                onToggle={() => {
                  setListBlurry((state) => !state)
                  updateListOptions({ blurForOwner: !isListBlurry })
                }}
              />
              <label
                className={styles.eventDate}
                title="Nach diesem Datum können reservierte Wünsche entfernt werden"
              >
                <span className={styles.eventDateText}>
                  <b>Anlass am</b>
                  <span>Danach kannst du Reserviertes aufräumen.</span>
                </span>
                <input
                  type="date"
                  value={list?.eventDate || ""}
                  onChange={handleChangeEventDate}
                />
              </label>

              <div
                className={`${styles.shareWrapper} ${isListShared ? "" : "crit_hidden"}`}
              >
                <span className={styles.shareLabel}>Link zum Teilen</span>
                <div className={styles.shareField}>
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    onClick={(e) => e.currentTarget.select()}
                    aria-label="Link zum Teilen"
                  />
                  <button
                    title={isShareAvailable ? "Liste teilen" : "Link kopieren"}
                    className={`btn btn-primary btn-sm ${styles.share}`}
                    onClick={shareOrCopyUrlToClipboard}
                  >
                    {isClicked ? (
                      <Check size={16} />
                    ) : isShareAvailable ? (
                      <FeatherLink size={16} />
                    ) : (
                      <Copy size={16} />
                    )}
                    {isClicked ? "Kopiert" : isShareAvailable ? "Teilen" : "Kopieren"}
                  </button>
                </div>
              </div>
            </aside>

            <section className={styles.wishes}>
              <div id="list" className={styles.list}>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={sortedEntryArray.map((entry) => entry[0])}
                  >
                    {sortedEntryArray.map(([id, entry]) => (
                      <Card
                        key={`wish_${id}`}
                        id={id}
                        value={entry.text}
                        link={entry.link}
                        priority={entry.priority}
                        onDelete={() => removeEntry(id)}
                        onSave={(_id, value) => {
                          updateEntry(id, { text: value })
                        }}
                        onAddLink={(value) => {
                          updateEntry(id, { link: value })
                        }}
                        onSetPriority={(priority) => {
                          updateEntry(id, { priority })
                        }}
                      />
                    ))}
                  </SortableContext>
                </DndContext>

                <AddCard
                  callback={() =>
                    addEntry({
                      text: "",
                      priority: Priority.medium,
                      position: sortedEntryArray.length,
                    }).then(() => {
                      const cards =
                        document.querySelectorAll<HTMLInputElement>(
                          "#list > .wish-card"
                        )
                      const lastCard = cards[cards.length - 1]
                      lastCard?.querySelector("textarea")?.focus()
                    })
                  }
                />
              </div>

              <p className={styles.hint}>
                <Move size={14} aria-hidden />
                Die Reihenfolge entspricht der geteilten Liste. Halte einen Zettel gedrückt, um ihn zu verschieben.
              </p>
            </section>
          </div>
        </>
      ) : (
        <div className="empty_state paper">
          <h2>Nicht angemeldet</h2>
          <p>Melde dich an, um deine Liste sehen zu können.</p>
          <Link href="/auth" className="btn btn-primary">Anmelden</Link>
        </div>
      )}
    </>
  )
}

export default List

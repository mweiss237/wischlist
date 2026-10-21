"use client"
import AddCard from "components/AddCard/AddCard"
import Card from "components/Card/Card"
import { DeleteTrashCan } from "components/DeleteTrashCan/DeleteTrashCan"
import { useDialog } from "components/Dialog/Dialog"
import Loading from "components/Loading/Loading"
import { useUser } from "lib/auth"
import { useEntries } from "lib/entries"
import { useList } from "lib/list"

import Link from "next/link"
import { useRouter } from "next/navigation"
import React from "react"
import { use, useState, useCallback } from "react"
import styles from "./List.module.scss"

import { Priority, SortOrder } from "types"
import { SORT_ORDER_LABELS, sortEntries } from "lib/sort"
import { hasCommitment } from "lib/gifts"
import { DndContext, useSensors, DragEndEvent } from "@dnd-kit/core"
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  closestCenter,
} from "@dnd-kit/core"
import { SortableContext, sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { Check, Copy, Eye, Link as FeatherLink, Move } from "react-feather"
import EmptyState from "components/EmptyState/EmptyState"
import Checkbox from "./ListOptions"
import { describeCountdown, formatEventDate, todayIsoDate } from "lib/date"

const List = ({ params }: { params: Promise<{ listId: string }> }) => {
  const router = useRouter()
  const { user, loading } = useUser()
  const dialog = useDialog()

  const { listId } = use(params)

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
    updateEntry,
    reorderEntries,
    setEntryMulti,
    resetEntries,
  } = useEntries(listId)

  // a multi entry with gifts counts as one wish, so the owner can't tell how many give it
  const takenEntryIds = React.useMemo(
    () =>
      Object.entries(entries || {}).flatMap(([id, entry]) =>
        hasCommitment(entry) ? [id] : []
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

  // the dialog is not blocking, so the effect could fire again before the redirect is done
  const isRedirecting = React.useRef(false)

  React.useEffect(() => {
    if (
      !isRedirecting.current &&
      !loading &&
      user !== null &&
      list &&
      user.uid !== list.userId
    ) {
      isRedirecting.current = true
      router.replace("/list")
      dialog.alert("Diese Liste gehört einem anderen Account.", {
        title: "Kein Zugriff",
      })
    }
  }, [user, list, router, loading, dialog])

  const handleDeleteList = useCallback(async () => {
    const confirmed = await dialog.confirm(
      "Die Liste und alle Wünsche darauf werden unwiederbringlich gelöscht.",
      { title: "Liste löschen?", confirmLabel: "Löschen", danger: true }
    )
    if (confirmed) {
      deleteList()
        .then(() => router.replace("/list"))
        .catch((error) => {
          console.error("[rtdb] delete list", error)
          dialog.alert("Liste konnte nicht gelöscht werden.", {
            title: "Hoppla",
          })
        })
    }
  }, [deleteList, router, dialog])

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

  // multi entries ("Dauerbrenner") stay on the list for the next occasion, only their gifts are cleared
  const handleRemoveTakenEntries = async () => {
    const multiEntryIds = takenEntryIds.filter((id) => entries?.[id]?.multi)
    const closedEntryIds = takenEntryIds.filter((id) => !entries?.[id]?.multi)

    const isSingleMulti = multiEntryIds.length === 1
    const message = !closedEntryIds.length
      ? `${multiEntryIds.length} Dauerbrenner wieder freigeben? ${isSingleMulti ? "Er bleibt" : "Sie bleiben"} auf der Liste, nur die Zusagen werden entfernt.`
      : [
          `${closedEntryIds.length} ${closedEntryIds.length === 1 ? "reservierten Wunsch" : "reservierte Wünsche"} endgültig von der Liste entfernen?`,
          multiEntryIds.length
            ? `${multiEntryIds.length} Dauerbrenner ${isSingleMulti ? "bleibt stehen und wird" : "bleiben stehen und werden"} wieder freigegeben.`
            : "",
        ].join(" ").trim()

    const confirmed = await dialog.confirm(message, {
      title: "Reservierte entfernen?",
      confirmLabel: closedEntryIds.length ? "Entfernen" : "Freigeben",
      danger: closedEntryIds.length > 0,
    })
    if (confirmed) {
      resetEntries(closedEntryIds, multiEntryIds).catch((error) => {
        console.error("[rtdb] remove taken entries", error)
        dialog.alert("Reservierte Wünsche konnten nicht entfernt werden.", {
          title: "Hoppla",
        })
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

  const sortOrder: SortOrder = list?.options?.sortOrder || "custom"
  const sortedEntryArray = sortEntries(entries, sortOrder)

  const handleChangeSortOrder: React.ChangeEventHandler<HTMLSelectElement> = (
    event
  ) => updateListOptions({ sortOrder: event.target.value as SortOrder })

  const shareUrl = `${window.location.href}/share`
  const wishCount = sortedEntryArray.length

  return (
    <>
      <header className={`page_header ${styles.header}`}>
        <div className={styles.titleBlock}>
          <label className="sr_only" htmlFor="list-title">Name der Liste</label>
          <input
            id="list-title"
            onChange={handleChangeListName}
            onBlur={handleBlurListName}
            type="text"
            value={listName || ""}
            placeholder="Name der Liste"
            className={`crit_textinput ${styles.titleInput}`}
          />
          <div className={styles.meta}>
            <span className="field">
              <span className="field_key">Wünsche</span>
              <span className="field_value">{wishCount}</span>
            </span>
            {list?.eventDate ? (
              <span className="field">
                <span className="field_key">Anlass am</span>
                <span className="field_value">
                  {formatEventDate(list.eventDate)} · {describeCountdown(list.eventDate)}
                </span>
              </span>
            ) : null}
            {/* the key replays the stamp when the status changes */}
            <span
              key={String(isListShared)}
              className={`stamp ${isListShared ? "stamp-primary" : "stamp-berry"} ${styles.stamp}`}
            >
              {isListShared ? "Geteilt" : "Nicht geteilt"}
            </span>
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
            <div className={`paper ${styles.pickedInfo}`}>
              <p>
                <b>
                  Bereits {takenEntryIds.length}{" "}
                  {takenEntryIds.length === 1 ? "Wunsch" : "Wünsche"} reserviert!
                </b>
                <span>Wer was schenkt, bleibt natürlich geheim.</span>
              </p>
              {isEventOver ? (
                <>
                  {/* below the perforation: what can be torn off after the occasion */}
                  <div className={`perforation ${styles.pickedPerforation}`} aria-hidden />
                  <div className={styles.pickedActions}>
                    <span>Der Anlass ist vorbei.</span>
                    <button className="btn btn-ghost btn-danger btn-sm" onClick={handleRemoveTakenEntries}>
                      Reservierte entfernen
                    </button>
                  </div>
                </>
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
              <label className={styles.sortOrder}>
                <span className={styles.eventDateText}>
                  <b>Sortierung</b>
                  <span>Gilt auch für die geteilte Liste.</span>
                </span>
                <select value={sortOrder} onChange={handleChangeSortOrder}>
                  {Object.entries(SORT_ORDER_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>

              {/* the share link is a shipping label, torn off along the perforation */}
              <div
                className={`${styles.shareWrapper} ${isListShared ? "" : "crit_hidden"}`}
              >
                <div className={`perforation ${styles.sharePerforation}`} aria-hidden />
                <div className={`shipping_label ${styles.shareLabel}`}>
                  <span className={styles.shareHead}>
                    <span className="field_key">Link zum Teilen</span>
                    <span className="barcode" aria-hidden />
                  </span>
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
                        multi={entry.multi}
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
                        onToggleMulti={() => {
                          setEntryMulti(id, entry, !entry.multi).catch(
                            (error) => {
                              console.error("[rtdb] toggle multi entry", error)
                              dialog.alert(
                                "Wunsch konnte nicht geändert werden.",
                                { title: "Hoppla" }
                              )
                            }
                          )
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
                    }).then(({ key }) => {
                      // with a sort order the new card is not necessarily the last one
                      document
                        .querySelector<HTMLElement>(
                          `#list > .wish-card[data-entry-id="${key}"]`
                        )
                        ?.querySelector("textarea")
                        ?.focus()
                    })
                  }
                />
              </div>

              <p className={styles.hint}>
                <Move size={14} aria-hidden />
                Die Reihenfolge entspricht der geteilten Liste. Halte einen Zettel gedrückt, um ihn zu verschieben.
                {sortOrder !== "custom"
                  ? " Danach gilt wieder deine eigene Sortierung."
                  : null}
              </p>
            </section>
          </div>
        </>
      ) : (
        <EmptyState
          text="Melde dich an, dann kannst du deine Liste bearbeiten."
          action={<Link href="/auth" className="btn btn-primary">Anmelden</Link>}
        />
      )}
    </>
  )
}

export default List

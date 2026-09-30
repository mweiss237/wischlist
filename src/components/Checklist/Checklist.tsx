"use client"

import React from 'react'
import styles from "./Checklist.module.scss"
import ChecklistEntry from "./ChecklistEntry"
import { useEntries } from "lib/entries"
import { useGiver } from "lib/giver"
import Loading from "components/Loading/Loading"
import { useList } from "lib/list"
import PriorityIcon from './Priority'
import { Priority } from 'types'
import { useUser } from 'lib/auth'
import Favorite from './Favorite'
import { useFavorites } from 'lib/favorite'
import Link from 'next/link'
import { Calendar } from 'react-feather'
import { describeCountdown, formatEventDate } from 'lib/date'

interface ChecklistParams {
  params: {
    listId: string
  }
}

const SORT_TO_THE_END = 0

const Checklist = ({ params }: ChecklistParams) => {
  const { listId } = params
  const { entries } = useEntries(listId)
  const { list } = useList(listId)
  const { giverName, setName } = useGiver()
  const { user, loading } = useUser()
  const { checkIsFavorite, addFavorite, removeFavorite } = useFavorites()

  const isListOwner = !!list?.userId && !!user?.uid && list.userId === user.uid
  const isSomeTaken = Object.values(entries || {}).some(entry => !!entry.taken?.timestamp)

  const isShared = list?.options?.isShared
  const isBlurred = isListOwner && isSomeTaken && list?.options?.blurForOwner && isShared

  const isFavorite = checkIsFavorite(listId)


  React.useEffect(() => {
    if (!loading && !user && giverName === null) {
      const name = prompt("Möchtest du deinen Namen hinterlegen?")
      setName(name || "")
    }
  }, [giverName, loading, setName, user])

  const sortedEntryIds = React.useMemo(() =>
    entries
      ? Object.keys(entries || {}).sort((a, b) =>
        (entries[a].position || SORT_TO_THE_END) - (entries[b].position || SORT_TO_THE_END)
      )
      : [],
    [entries]
  )

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className="eyebrow">Ich wünsche mir…</span>
        <h1 className={styles.title}>{(isShared && list?.title) || "Wunschliste"}</h1>
        {isShared && list?.eventDate ? (
          <span className="chip chip-gold">
            <Calendar size={12} aria-hidden /> {formatEventDate(list.eventDate)} · {describeCountdown(list.eventDate)}
          </span>
        ) : null}
      </header>

      <div className={styles.giverWrapper}>
        {user === null ? (
          <>
            <label className={styles.giverField}>
              <span>Ich bin</span>
              <input
                type="text"
                className="crit_textinput"
                placeholder="anonym"
                disabled={loading || user !== null}
                value={giverName || ""}
                onChange={(event) => setName(event.currentTarget.value)}
              />
            </label>
            <p className={styles.info}>
              Trag deinen Namen ein, damit andere sehen, was du schenkst.
            </p>
          </>
        ) : (
          <p className={styles.giverField}>
            Du schenkst als <Link href={"/profile"} className="link">{user.displayName}</Link>
          </p>
        )}
      </div>

      <div className={`${styles.checklist_wrapper} paper`}>
        <span className={styles.tape} aria-hidden />
        {user ? (
          <Favorite
            isFavorite={isFavorite}
            setIsFavorite={() => isFavorite ? removeFavorite(listId) : addFavorite(listId, list?.title || "")}
          />
        ) : null}
        <div className={`${styles.checklist} ${isBlurred ? styles.blurry : ""}`}>
          {
            isShared ?
              !entries || !list ? <Loading className={styles.centered} /> :
                sortedEntryIds.map((entryId) => (
                  <ChecklistEntry
                    entry={entries[entryId]}
                    entryId={entryId}
                    listId={listId}
                    key={`wish${entryId}`}
                  />
                ))
              : <p className={styles.notShared}>Diese Liste wird aktuell nicht geteilt.</p>
          }
        </div>

        <footer className={styles.legend}>
          <span>Priorität:</span>
          <span><PriorityIcon priority={Priority.high} /> Hoch</span>
          <span><PriorityIcon priority={Priority.medium} /> Mittel</span>
          <span><PriorityIcon priority={Priority.low} /> Niedrig</span>
        </footer>
      </div>
    </div>
  )
}

export default Checklist

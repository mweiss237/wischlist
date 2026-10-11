"use client"

import React from 'react'
import styles from "./Checklist.module.scss"
import ChecklistEntry from "./ChecklistEntry"
import ChecklistMultiEntry from "./ChecklistMultiEntry"
import GiverIntro from "./GiverIntro"
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
import { Calendar, Users } from 'react-feather'
import { describeCountdown, formatEventDate } from 'lib/date'
import { sortEntries } from 'lib/sort'
import { hasCommitment } from 'lib/gifts'

interface ChecklistParams {
  params: {
    listId: string
  }
}

const Checklist = ({ params }: ChecklistParams) => {
  const { listId } = params
  const { entries } = useEntries(listId)
  const { list } = useList(listId)
  const { giverName, setName, isReady, hasSkipped, skip } = useGiver()
  const { user, loading } = useUser()
  const { checkIsFavorite, addFavorite, removeFavorite } = useFavorites()

  const isListOwner = !!list?.userId && !!user?.uid && list.userId === user.uid
  const isSomeTaken = Object.values(entries || {}).some(hasCommitment)
  const hasMultiEntries = Object.values(entries || {}).some(entry => !!entry.multi)

  const isShared = list?.options?.isShared
  const isBlurred = isListOwner && isSomeTaken && list?.options?.blurForOwner && isShared

  // anonymous first-time givers are asked for their name before the list, decided once per visit
  const [isIntroActive, setIntroActive] = React.useState(false)
  const [isDimmed, setDimmed] = React.useState(false)
  const isIntroDecided = React.useRef(false)
  const listRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (isIntroDecided.current || !isReady || loading || !list) return
    isIntroDecided.current = true
    if (user === null && isShared && !giverName?.trim() && !hasSkipped) {
      setIntroActive(true)
      setDimmed(true)
    }
  }, [isReady, loading, list, user, isShared, giverName, hasSkipped])

  const dismissIntro = React.useCallback(() => {
    setIntroActive(false)
    setDimmed(false)
    // after the intro collapsed, so the list lands where it ends up
    requestAnimationFrame(() => listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }))
  }, [])

  // answered further down, e.g. in the name prompt of a wish
  React.useEffect(() => {
    if (giverName?.trim() || hasSkipped) setIntroActive(false)
  }, [giverName, hasSkipped])

  // scrolling down only brightens the list, the intro stays put so nothing jumps under the finger
  React.useEffect(() => {
    if (!isDimmed) return
    const handleScroll = () => {
      if (window.scrollY > 60) setDimmed(false)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isDimmed])

  const isFavorite = checkIsFavorite(listId)

  const sortOrder = list?.options?.sortOrder
  const sortedEntryIds = React.useMemo(() =>
    sortEntries(entries, sortOrder).map(([id]) => id),
    [entries, sortOrder]
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

      {isIntroActive ? (
        <GiverIntro
          onSubmit={(name) => {
            setName(name)
            dismissIntro()
          }}
          onSkip={() => {
            skip()
            dismissIntro()
          }}
        />
      ) : <div className={styles.giverWrapper}>
        {user === null ? (
          <>
            <label className={styles.giverField}>
              <span>Ich bin</span>
              <input
                type="text"
                className="crit_textinput"
                placeholder="anonym"
                maxLength={100}
                autoComplete="name"
                aria-describedby="giver-info"
                disabled={loading || user !== null}
                value={giverName || ""}
                onChange={(event) => setName(event.currentTarget.value)}
              />
            </label>
            <p id="giver-info" className={styles.info}>
              Trag deinen Namen ein, damit andere sehen, was du schenkst.
            </p>
          </>
        ) : (
          <p className={styles.giverField}>
            Du schenkst als <Link href={"/profile"} className="link">{user.displayName}</Link>
          </p>
        )}
      </div>}

      <div
        ref={listRef}
        className={`${styles.checklist_wrapper} ${isDimmed ? styles.dimmed : ""} paper`}
        onPointerDownCapture={isDimmed ? () => setDimmed(false) : undefined}
      >
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
                sortedEntryIds.map((entryId) => {
                  const EntryComponent = entries[entryId].multi ? ChecklistMultiEntry : ChecklistEntry
                  return (
                    <EntryComponent
                      entry={entries[entryId]}
                      entryId={entryId}
                      listId={listId}
                      key={`wish${entryId}`}
                    />
                  )
                })
              : <p className={styles.notShared}>Diese Liste wird aktuell nicht geteilt.</p>
          }
        </div>

        <footer className={styles.legend}>
          <span>Priorität:</span>
          <span><PriorityIcon priority={Priority.high} /> Hoch</span>
          <span><PriorityIcon priority={Priority.medium} /> Mittel</span>
          <span><PriorityIcon priority={Priority.low} /> Niedrig</span>
          {isShared && hasMultiEntries ? (
            <span className={styles.legendMulti}><Users aria-hidden /> Mehrfach schenkbar</span>
          ) : null}
        </footer>
      </div>
    </div>
  )
}

export default Checklist

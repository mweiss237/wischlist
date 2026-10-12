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
import PriorityTape from './Priority'
import { Priority } from 'types'
import { useUser } from 'lib/auth'
import Favorite from './Favorite'
import { useFavorites } from 'lib/favorite'
import Link from 'next/link'
import { daysUntil, describeDaysLeft, formatEventDate } from 'lib/date'
import { sortEntries } from 'lib/sort'
import { hasCommitment } from 'lib/gifts'
import { DoodleCircle } from 'components/Doodle/Doodle'

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

  const eventDate = isShared ? list?.eventDate : undefined
  const isEventOver = !!eventDate && daysUntil(eventDate) < 0

  return (
    <div className={styles.page}>
      {/* the head is a shipping label: what the list is for and when */}
      <header className={styles.header}>
        <span className={`remark ${styles.remark}`}>Ich wünsche mir…</span>
        <div className={`shipping_label ${styles.label}`}>
          <div className={styles.labelTitle}>
            <span className="field_key">Wunschliste</span>
            <h1 className={styles.title}>{(isShared && list?.title) || "Wunschliste"}</h1>
          </div>
          {eventDate ? (
            <div className={styles.labelFields}>
              <div className="field">
                <span className="field_key">Am</span>
                <span className="field_value">{formatEventDate(eventDate)}</span>
              </div>
              {isEventOver ? (
                <span className={`stamp ${styles.overStamp}`}>Event vorbei</span>
              ) : (
                <div className="field">
                  <span className="field_key">Noch</span>
                  <span className={`field_value ${styles.countdown}`}>
                    {describeDaysLeft(eventDate)}
                    <DoodleCircle draw className={styles.countdownCircle} />
                  </span>
                </div>
              )}
            </div>
          ) : null}
          <span className={`barcode ${styles.barcode}`} aria-hidden />
        </div>
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
            {/* a small gift tag to sign, like the big one in the intro */}
            <label className={styles.giverTag}>
              <span className={styles.giverKey}>Von</span>
              <input
                type="text"
                className={`crit_textinput ${styles.giverInput}`}
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

      {/* one ruled sheet, taped to the table, torn off at the bottom */}
      <div
        ref={listRef}
        className={`${styles.sheetWrapper} ${isDimmed ? styles.dimmed : ""}`}
        onPointerDownCapture={isDimmed ? () => setDimmed(false) : undefined}
      >
        <span className={`tape ${styles.tape}`} aria-hidden />
        {user ? (
          <Favorite
            isFavorite={isFavorite}
            setIsFavorite={() => isFavorite ? removeFavorite(listId) : addFavorite(listId, list?.title || "")}
          />
        ) : null}
        <div className={`${styles.sheet} torn_bottom`}>
          {isShared ? (
            <div className={`${styles.checklist} ${isBlurred ? `${styles.blurry} is_blurred` : ""}`}>
              {!entries || !list ? <Loading className={styles.centered} /> :
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
                })}
            </div>
          ) : (
            <div className={styles.notShared}>
              <span className="stamp stamp-berry">Nicht geteilt</span>
              <p>Diese Liste wird aktuell nicht geteilt.</p>
            </div>
          )}

          {isShared ? (
            <footer className={styles.legend}>
              <div className="perforation" aria-hidden />
              <p className={styles.footnote}>
                <span>Priorität:</span>
                <span><PriorityTape priority={Priority.high} /> hoch</span>
                <span><PriorityTape priority={Priority.medium} /> mittel</span>
                <span><PriorityTape priority={Priority.low} /> niedrig</span>
              </p>
              {hasMultiEntries ? (
                <p className={styles.footnote}>
                  <span className={styles.legendMulti}>mehrfach</span> = mehrere können etwas davon schenken
                </p>
              ) : null}
            </footer>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default Checklist

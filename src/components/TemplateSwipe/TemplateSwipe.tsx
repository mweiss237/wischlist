"use client"
import { useDialog } from "components/Dialog/Dialog"
import { DoodleArrow } from "components/Doodle/Doodle"
import EmptyState from "components/EmptyState/EmptyState"
import Loading from "components/Loading/Loading"
import { useOwnerGuard } from "components/TemplatePicker/useOwnerGuard"
import { useIsAdmin } from "lib/admin"
import { useEntries } from "lib/entries"
import { normalizeText, useTemplate, useTemplateSuggestions } from "lib/templates"
import Link from "next/link"
import React, { use, useEffect, useState } from "react"
import { ArrowLeft, Check, RotateCcw, X } from "react-feather"
import { Priority, TemplateSuggestion } from "types"
import SwipeCard, { SwipeDirection } from "./SwipeCard"
import styles from "./TemplateSwipe.module.scss"

type SuggestionTuple = [id: string, suggestion: TemplateSuggestion]

interface Decision {
  direction: SwipeDirection
  // set for adopted ideas, so "Rückgängig" can remove the entry again
  entryKey?: string
}

const FLY_OFF_MS = 220

// swipe through the ideas of one topic: right takes the idea into the list, left skips it
const TemplateSwipe = ({ params }: { params: Promise<{ listId: string; templateId: string }> }) => {
  const { listId, templateId } = use(params)
  const { user, loading, isOwner } = useOwnerGuard(listId)
  const dialog = useDialog()
  const isAdmin = useIsAdmin()
  const template = useTemplate(templateId)
  const suggestions = useTemplateSuggestions(templateId)
  const { entries, loaded, addEntry, removeEntry } = useEntries(listId)

  // the pile is fixed once: ideas that are already on the list never show up, adopted ones don't vanish mid-swipe
  const [deck, setDeck] = useState<SuggestionTuple[] | null>(null)
  const [decisions, setDecisions] = useState<Decision[]>([])
  const [leaving, setLeaving] = useState<SwipeDirection | null>(null)
  // the first note nudges itself until someone drags, taps a button or uses the keys
  const [interacted, setInteracted] = useState(false)

  useEffect(() => {
    if (deck !== null || suggestions === null || !loaded) return
    const onList = new Set(Object.values(entries || {}).map((entry) => normalizeText(entry.text || "")))
    setDeck(suggestions.filter(([, suggestion]) => !onList.has(normalizeText(suggestion.text))))
  }, [deck, suggestions, loaded, entries])

  const index = decisions.length
  const isDone = deck !== null && index >= deck.length

  const logError = (what: string, error: unknown) => {
    console.error(`[rtdb] ${what}`, error)
    dialog.alert("Das hat nicht geklappt. Versuch es noch einmal.", { title: "Hoppla" })
  }

  const decide = (direction: SwipeDirection) => {
    if (!deck || leaving || isDone) return
    setInteracted(true)
    const [, suggestion] = deck[index]

    const commit = () => {
      let entryKey: string | undefined
      if (direction === "right") {
        const request = addEntry({
          text: suggestion.text,
          ...(suggestion.link ? { link: suggestion.link } : {}),
          priority: suggestion.priority ?? Priority.medium,
          position: Object.keys(entries || {}).length + decisions.filter((d) => d.entryKey).length,
        })
        entryKey = request.key ?? undefined
        request.catch((error) => logError("add entry from template", error))
      }
      setDecisions((previous) => [...previous, { direction, entryKey }])
      setLeaving(null)
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      commit()
    } else {
      setLeaving(direction)
      setTimeout(commit, FLY_OFF_MS)
    }
  }

  const undo = () => {
    const last = decisions[decisions.length - 1]
    if (!last || leaving) return
    if (last.entryKey) removeEntry(last.entryKey).catch((error) => logError("undo entry from template", error))
    setDecisions((previous) => previous.slice(0, -1))
  }

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return
      if (event.altKey || event.ctrlKey || event.metaKey) return
      if (event.key === "ArrowRight") decide("right")
      else if (event.key === "ArrowLeft") decide("left")
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  })

  if (loading) return <Loading />

  if (!user) {
    return (
      <EmptyState
        text="Melde dich an, dann kannst du Ideen für deine Liste stöbern."
        action={<Link href="/auth" className="btn btn-primary">Anmelden</Link>}
      />
    )
  }

  if (!isOwner || template === undefined || isAdmin === null) return <Loading />

  // drafts are only for admins who preview them
  if (template === null || (!template.published && !isAdmin)) {
    return (
      <EmptyState
        text="Dieses Thema gibt es nicht."
        action={<Link href={`/list/${listId}/ideas`} className="btn btn-primary">Zu den Themen</Link>}
      />
    )
  }

  if (deck === null) return <Loading />

  const adopted = decisions.filter((decision) => decision.direction === "right").length

  return (
    <>
      <header className="page_header">
        <Link href={`/list/${listId}/ideas`} className={`btn-tertiary ${styles.back}`}>
          <ArrowLeft size={16} aria-hidden /> Andere Themen
        </Link>
        <h1>{template.title}</h1>
        {template.description ? <p>{template.description}</p> : null}
      </header>

      {deck.length === 0 ? (
        <EmptyState
          text="Alles davon steht schon auf deiner Liste."
          action={<Link href={`/list/${listId}/ideas`} className="btn btn-primary">Anderes Thema</Link>}
        />
      ) : isDone ? (
        <div className={styles.done}>
          <p className={styles.doneText}>
            {adopted === 0
              ? "Diesmal war nichts dabei."
              : `${adopted} ${adopted === 1 ? "Idee" : "Ideen"} auf deiner Liste.`}
          </p>
          <div className={styles.doneActions}>
            <Link href={`/list/${listId}`} className="btn btn-primary">Zur Liste</Link>
            <Link href={`/list/${listId}/ideas`} className="btn btn-ghost">Anderes Thema</Link>
            <button type="button" className={`btn-tertiary ${styles.undo}`} onClick={undo}>
              <RotateCcw size={14} aria-hidden /> Rückgängig
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.stage}>
          <div className={styles.meta}>
            <span className="field">
              <span className="field_key">Idee</span>
              <span className="field_value">{index + 1} / {deck.length}</span>
            </span>
            {index === 0 ? (
              <span className={styles.hint}>
                <DoodleArrow draw className={styles.hintArrow} />
                Nach rechts ziehen, wenn du sie willst
              </span>
            ) : null}
          </div>

          <div className={styles.pile}>
            {/* two blank sheets behind the note, always two like on a pad */}
            {deck.length - index > 2 ? <div className={`${styles.sheet} ${styles.sheetBottom}`} aria-hidden /> : null}
            {deck.length - index > 1 ? <div className={`${styles.sheet} ${styles.sheetMiddle}`} aria-hidden /> : null}
            <SwipeCard
              key={deck[index][0]}
              suggestion={deck[index][1]}
              leaving={leaving}
              onSwipe={decide}
              hint={!interacted && index === 0}
              onGrab={() => setInteracted(true)}
            />
          </div>

          <div className={styles.actions}>
            <button type="button" className="btn btn-ghost" onClick={() => decide("left")} disabled={!!leaving}>
              <X size={18} aria-hidden /> Überspringen
            </button>
            <button type="button" className="btn btn-primary" onClick={() => decide("right")} disabled={!!leaving}>
              <Check size={18} aria-hidden /> Auf die Liste
            </button>
          </div>
          <button
            type="button"
            className={`btn-tertiary ${styles.undo}`}
            onClick={undo}
            disabled={!decisions.length || !!leaving}
          >
            <RotateCcw size={14} aria-hidden /> Rückgängig
          </button>
          <p className={styles.keys}>Auch mit den Pfeiltasten ← →</p>
        </div>
      )}
    </>
  )
}

export default TemplateSwipe

"use client"
import React, { useRef, useState } from "react"
import { Link2 } from "react-feather"
import { TemplateSuggestion } from "types"
import styles from "./TemplateSwipe.module.scss"

export type SwipeDirection = "left" | "right"

interface SwipeCardProps {
  suggestion: TemplateSuggestion
  // set by the parent once a decision is made (drag, buttons or keys), the card then flies off
  leaving: SwipeDirection | null
  onSwipe: (direction: SwipeDirection) => void
  // nudges the note to the right until the first interaction, so it is clear that it can be dragged
  hint?: boolean
  onGrab?: () => void
}

const THRESHOLD = 0.3
const MIN_VELOCITY = 0.6 // px per ms
const MAX_TILT = 8

const PRIORITY_LABELS = {
  1: "Hohe Priorität",
  2: "Mittlere Priorität",
  3: "Niedrige Priorität",
} as const

// the top note of the pile: drag it to the right to take the idea, to the left to skip it
const SwipeCard = ({
  suggestion,
  leaving,
  onSwipe,
  hint = false,
  onGrab,
}: SwipeCardProps) => {
  const [dx, setDx] = useState(0)
  const [dragging, setDragging] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const startX = useRef(0)
  const lastMove = useRef({ x: 0, time: 0, velocity: 0 })

  const handlePointerDown: React.PointerEventHandler<HTMLDivElement> = (
    event
  ) => {
    if (leaving) return
    // the link on the title stays a normal link, a press on it never starts a drag
    if ((event.target as HTMLElement).closest("a")) return
    onGrab?.()
    event.currentTarget.setPointerCapture(event.pointerId)
    startX.current = event.clientX
    lastMove.current = { x: event.clientX, time: event.timeStamp, velocity: 0 }
    setDragging(true)
  }

  const handlePointerMove: React.PointerEventHandler<HTMLDivElement> = (
    event
  ) => {
    if (!dragging) return
    const elapsed = event.timeStamp - lastMove.current.time
    if (elapsed > 0) {
      lastMove.current.velocity = (event.clientX - lastMove.current.x) / elapsed
      lastMove.current.x = event.clientX
      lastMove.current.time = event.timeStamp
    }
    setDx(event.clientX - startX.current)
  }

  const handlePointerEnd: React.PointerEventHandler<HTMLDivElement> = () => {
    if (!dragging) return
    setDragging(false)
    const width = cardRef.current?.offsetWidth || 300
    const { velocity } = lastMove.current
    const flicked =
      Math.abs(velocity) > MIN_VELOCITY &&
      Math.abs(dx) > 40 &&
      Math.sign(velocity) === Math.sign(dx)
    if (Math.abs(dx) > width * THRESHOLD || flicked)
      onSwipe(dx > 0 ? "right" : "left")
    else setDx(0)
  }

  const handlePointerCancel: React.PointerEventHandler<HTMLDivElement> = () => {
    setDragging(false)
    setDx(0)
  }

  // the pile lies straight, it only tilts while it is held or flying away
  const tilt = leaving
    ? leaving === "right"
      ? MAX_TILT
      : -MAX_TILT
    : Math.max(-MAX_TILT, Math.min(MAX_TILT, dx / 20))
  const offset = leaving ? (leaving === "right" ? "130%" : "-130%") : `${dx}px`
  const strength = leaving ? 1 : Math.min(1, Math.abs(dx) / 100)
  // at rest the take verdict is ready, the nudge lets it shine through
  const direction = leaving || (dx < 0 ? "left" : "right")
  const nudging = hint && !dragging && !leaving && dx === 0

  return (
    <div
      ref={cardRef}
      className={`${styles.card} ${dragging ? styles.held : ""} ${nudging ? styles.nudge : ""}`}
      style={{ transform: `translateX(${offset}) rotate(${tilt}deg)` }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerCancel}
    >
      {/* priority is the colored tape, narrower for lower priority */}
      {suggestion.priority ? (
        <span
          className={styles.prio}
          data-priority={suggestion.priority}
          title={PRIORITY_LABELS[suggestion.priority]}
        >
          <span className="sr_only">
            {PRIORITY_LABELS[suggestion.priority]}
          </span>
        </span>
      ) : null}

      <span
        className={`${styles.verdict} ${direction === "right" ? styles.verdictTake : styles.verdictSkip}`}
        style={{ opacity: strength }}
        aria-hidden
      >
        {direction === "right" ? "Auf die Liste" : "Überspringen"}
      </span>

      {suggestion.link ? (
        <a
          href={suggestion.link}
          target="_blank"
          rel="noreferrer"
          className={styles.text}
          title={suggestion.text}
          onPointerDown={(event) => event.stopPropagation()}
        >
          {suggestion.text}{" "}<Link2 size={18} />
        </a>
      ) : (
        <p className={styles.text}>{suggestion.text}</p>
      )}

      {suggestion.description ? (
        <p className={styles.note}>{suggestion.description}</p>
      ) : null}
    </div>
  )
}

export default SwipeCard

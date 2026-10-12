import Link from "next/link"
import { Scissors } from "react-feather"
import { daysUntil, describeDaysLeft, formatEventDate } from "lib/date"
import InlinePrompt from "components/InlinePrompt/InlinePrompt"
import { Bow } from "components/Doodle/Doodle"
import styles from "./ListCard.module.scss"

// wrapping paper per list: color and pattern are picked stably from the list id
const wrappings = ["evergreen", "berry", "gold", "plum", "navy", "copper"] as const
const patterns = ["stripes", "dots", "stars", "diamonds", "herringbone"] as const

const hashId = (id: string) => {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) % 997
  }
  return hash
}

export const pickWrapping = (id: string) => {
  const hash = hashId(id)
  return {
    wrapping: wrappings[hash % wrappings.length],
    // from the next digits of the hash, so the pattern does not follow the color
    pattern: patterns[Math.floor(hash / wrappings.length) % patterns.length],
  }
}

const stamps = {
  shared: { label: "Geteilt", className: "stamp-primary" },
  private: { label: "Nicht geteilt", className: "stamp-berry" },
  favorite: { label: "Gemerkt", className: "" },
}

interface ListCardProps {
  id: string
  href: string
  title: string
  status: keyof typeof stamps
  eventDate?: string
}

// a list is a wrapped present, title and details sit on a label stuck onto it
export const ListCard = ({ id, href, title, status, eventDate }: ListCardProps) => {
  const { wrapping, pattern } = pickWrapping(id)
  const stamp = stamps[status]
  const isOver = !!eventDate && daysUntil(eventDate) < 0

  return (
    <Link href={href} id={id} className={styles.card}>
      <div className={styles.wrap} data-wrapping={wrapping} data-pattern={pattern} aria-hidden>
        <Bow className={styles.bow} />
      </div>
      <div className={styles.label}>
        <h3 className={styles.title}>{title || "Ohne Titel"}</h3>
        <div className={styles.meta}>
          {eventDate ? (
            <>
              <span className="field">
                <span className="field_key">Am</span>
                <span className={`field_value ${styles.value}`}>{formatEventDate(eventDate)}</span>
              </span>
              {!isOver ? (
                <span className="field">
                  <span className="field_key">Noch</span>
                  <span className={`field_value ${styles.value}`}>{describeDaysLeft(eventDate)}</span>
                </span>
              ) : null}
            </>
          ) : null}
          <span className={`stamp ${stamp.className} ${styles.stamp}`}>
            {isOver ? "Event vorbei" : stamp.label}
          </span>
        </div>
      </div>
    </Link>
  )
}

interface AddListCardProps {
  isCreating: boolean
  onOpen: () => void
  onCreate: (title: string) => void
  onCancel: () => void
}

// a cut line: here a new list is made. Turns into the name field itself.
export const AddListCard = ({ isCreating, onOpen, onCreate, onCancel }: AddListCardProps) => {
  if (!isCreating) {
    return (
      <button type="button" className={styles.addCard} onClick={onOpen}>
        <Scissors size={20} className={styles.scissors} aria-hidden />
        Neue Liste
      </button>
    )
  }

  return (
    <div className={`${styles.addCard} ${styles.creating}`}>
      <Scissors size={20} className={styles.scissors} aria-hidden />
      <InlinePrompt
        className={styles.createPrompt}
        label="Wie soll die Liste heißen?"
        placeholder="z. B. Geburtstag"
        maxLength={100}
        submitLabel="Liste anlegen"
        compact
        onSubmit={onCreate}
        onCancel={onCancel}
      />
    </div>
  )
}

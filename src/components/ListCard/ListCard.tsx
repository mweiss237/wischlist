import Link from "next/link"
import { Calendar, Gift, Plus, Star } from "react-feather"
import { describeCountdown, formatEventDate } from "lib/date"
import styles from "./ListCard.module.scss"

// festive wrapping paper colors, picked stably per list id
const wrappings = ["evergreen", "berry", "gold", "plum", "navy", "copper"] as const

const pickWrapping = (id: string) => {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) % 997
  }
  return wrappings[hash % wrappings.length]
}

interface ListCardProps {
  id: string
  href: string
  title: string
  badge: string
  variant?: "gift" | "favorite"
  eventDate?: string
}

export const ListCard = ({ id, href, title, badge, variant = "gift", eventDate }: ListCardProps) => {
  const Icon = variant === "favorite" ? Star : Gift

  return (
    <Link href={href} id={id} className={styles.card} data-wrapping={pickWrapping(id)}>
      <div className={styles.wrap} aria-hidden>
        <span className={styles.bow}>
          <Icon size={18} />
        </span>
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>{title || "Ohne Titel"}</h3>
        <div className={styles.meta}>
          <span className={`chip ${badge === "Geteilt" ? "chip-green" : ""}`}>{badge}</span>
          {eventDate ? (
            <span className="chip chip-gold" title={formatEventDate(eventDate)}>
              <Calendar size={12} aria-hidden /> {describeCountdown(eventDate)}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  )
}

export const AddListCard = ({ onClick }: { onClick: () => void }) => (
  <button type="button" className={styles.addCard} onClick={onClick}>
    <span className={styles.addIcon}>
      <Plus size={22} aria-hidden />
    </span>
    Neue Liste
  </button>
)

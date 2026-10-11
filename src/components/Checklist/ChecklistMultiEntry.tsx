import { useUser } from "lib/auth"
import { addGift, removeGift } from "lib/entries"
import { useGiver } from "lib/giver"
import { getGifts, isOwnGift, NOTE_MAX_LENGTH } from "lib/gifts"
import { Check, ExternalLink, Gift, Plus, Users, X } from "react-feather"
import { Entry } from "types"
import entryStyles from "./ChecklistEntry.module.scss"
import styles from "./ChecklistMultiEntry.module.scss"
import PriorityIcon from "./Priority"

interface ChecklistMultiEntryParams {
  entry: Entry
  entryId: string
  listId: string
}

// a "Dauerbrenner": stays open, every giver is listed below with an optional note
const ChecklistMultiEntry = ({ entry, entryId, listId }: ChecklistMultiEntryParams) => {

  const { giverName, ownGiftIds, rememberGift, forgetGift } = useGiver()
  const { user } = useUser()

  const userName = user?.displayName || giverName
  const gifts = getGifts(entry)
  const ownGifts = gifts.filter((gift) => isOwnGift(gift, ownGiftIds, userName))
  const hasOwnGift = ownGifts.length > 0
  // anonymous givers without a name can't be told apart, so they may commit several times
  const canAdd = !hasOwnGift || !userName?.trim()

  const handleAdd = () => {
    const note = prompt("Was genau schenkst du? Das sehen nur andere Schenkende, damit nichts doppelt kommt. (Leer lassen ist auch okay)")
    if (note === null) return

    const giftRef = addGift(listId, entryId, userName?.trim() || null, note.trim().slice(0, NOTE_MAX_LENGTH))
    const giftId = giftRef.key
    if (giftId) rememberGift(giftId)

    giftRef.catch(() => {
      if (giftId) forgetGift(giftId)
      alert("Du konntest nicht eingetragen werden.")
    })
  }

  const handleRemove = (giftId: string) => {
    if (confirm("Möchtest du deine Zusage wirklich zurückziehen?"))
      removeGift(listId, entryId, giftId)
        .then(() => forgetGift(giftId))
        .catch(() => alert("Zusage konnte nicht entfernt werden."))
  }

  const handleToggle = () => {
    if (!hasOwnGift) return handleAdd()
    // with several own gifts the latest one is withdrawn
    handleRemove(ownGifts[ownGifts.length - 1][0])
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.head}>
        <button
          type="button"
          className={`${styles.toggle} ${hasOwnGift ? styles.checked : ""}`}
          onClick={handleToggle}
          aria-pressed={hasOwnGift}
          title={hasOwnGift ? "Zusage zurückziehen" : "Ich schenke etwas davon"}
        >
          {hasOwnGift ? <Check size={14} strokeWidth={3.5} /> : <Plus size={14} strokeWidth={3} />}
        </button>
        <span className={styles.title}>
          <span className={entryStyles.text}>{entry?.text}</span>
          <span className="chip chip-gold" title="Mehrere können diesen Wunsch schenken">
            <Users size={12} aria-hidden /> Mehrfach
          </span>
        </span>
        {entry?.link ?
          <a href={entry.link} target="_blank" rel="noreferrer" className={entryStyles.share} title="Link öffnen">
            <ExternalLink size={16} />
          </a>
          : null}
        <span className={entryStyles.priority}>
          <PriorityIcon priority={entry?.priority} />
        </span>
      </div>

      <ul className={styles.gifts}>
        {gifts.map((gift) => {
          const [giftId, { giver, note }] = gift
          const isOwn = isOwnGift(gift, ownGiftIds, userName)

          return (
            <li key={giftId} className={`${styles.gift} ${isOwn ? styles.own : ""}`}>
              <span className={entryStyles.giver}>
                <Gift size={12} aria-hidden /> {giver || "jemand"}{isOwn ? " (du)" : ""}
              </span>
              {note ? <span className={styles.note}>„{note}“</span> : null}
              {isOwn ? (
                <button
                  type="button"
                  className={styles.remove}
                  onClick={() => handleRemove(giftId)}
                  title="Zusage zurückziehen"
                >
                  <X size={14} />
                </button>
              ) : null}
            </li>
          )
        })}
        {canAdd ? (
          <li>
            <button type="button" className={styles.add} onClick={handleAdd}>
              <Plus size={14} aria-hidden />
              {gifts.length ? "Ich schenke auch etwas davon" : "Ich schenke etwas davon"}
            </button>
          </li>
        ) : null}
      </ul>
    </div>
  )
}

export default ChecklistMultiEntry

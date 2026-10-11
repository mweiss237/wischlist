import { useDialog } from "components/Dialog/Dialog"
import InlinePrompt from "components/InlinePrompt/InlinePrompt"
import { useUser } from "lib/auth"
import React from "react"
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
  const dialog = useDialog()

  const userName = user?.displayName || giverName
  const gifts = getGifts(entry)
  const ownGifts = gifts.filter((gift) => isOwnGift(gift, ownGiftIds, userName))
  const hasOwnGift = ownGifts.length > 0
  // anonymous givers without a name can't be told apart, so they may commit several times
  const canAdd = !hasOwnGift || !userName?.trim()
  // asks for the note right below the entry before the gift is saved
  const [isAdding, setAdding] = React.useState(false)

  const handleAdd = (note: string) => {
    setAdding(false)

    const giftRef = addGift(listId, entryId, userName?.trim() || null, note.slice(0, NOTE_MAX_LENGTH))
    const giftId = giftRef.key
    if (giftId) rememberGift(giftId)

    giftRef.catch(() => {
      if (giftId) forgetGift(giftId)
      dialog.alert("Du konntest nicht eingetragen werden.", { title: "Hoppla" })
    })
  }

  const handleRemove = async (giftId: string) => {
    const confirmed = await dialog.confirm("Deine Zusage wird von der Liste entfernt.", {
      title: "Zusage zurückziehen?",
      confirmLabel: "Zurückziehen",
      danger: true,
    })
    if (confirmed)
      removeGift(listId, entryId, giftId)
        .then(() => forgetGift(giftId))
        .catch(() => dialog.alert("Zusage konnte nicht entfernt werden.", { title: "Hoppla" }))
  }

  const handleToggle = () => {
    if (!hasOwnGift) return setAdding((value) => !value)
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
        {canAdd && isAdding ? (
          <li className={styles.prompt}>
            <InlinePrompt
              label="Was genau schenkst du?"
              hint="Das sehen nur andere Schenkende, damit nichts doppelt kommt. Leer lassen ist auch okay."
              placeholder="z. B. Band 3"
              maxLength={NOTE_MAX_LENGTH}
              submitLabel="Eintragen"
              allowEmpty
              onSubmit={handleAdd}
              onCancel={() => setAdding(false)}
            />
          </li>
        ) : canAdd ? (
          <li>
            <button type="button" className={styles.add} onClick={() => setAdding(true)}>
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

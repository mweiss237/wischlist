import { useUser } from "lib/auth"
import { pickEntry, removeGift, unpickEntry } from "lib/entries"
import { useGiver } from "lib/giver"
import { getGifts, isEntryClosed, isOwnGift } from "lib/gifts"
import { ExternalLink, Gift } from "react-feather"
import { Entry } from "types"
import styles from "./ChecklistEntry.module.scss"
import PriorityIcon from "./Priority"

interface ChecklistEntryParams {
  entry: Entry
  entryId: string
  listId: string
}

const ChecklistEntry = ({ entry, entryId, listId }: ChecklistEntryParams) => {

  const { giverName, ownGiftIds, forgetGift } = useGiver()
  const { user } = useUser()

  const userName = user?.displayName || giverName
  const isTaken = isEntryClosed(entry)
  // a former multi entry keeps its gifts and counts as taken by all of them
  const gifts = entry?.taken ? [] : getGifts(entry)
  const givers = entry?.taken
    ? [entry.taken.giver || "jemand"]
    : gifts.map(([, gift]) => gift.giver || "jemand")

  const handleRemoveOwnGift = () => {
    const ownGift = gifts.find((gift) => isOwnGift(gift, ownGiftIds, userName))
    if (!ownGift)
      return alert(`Dieser Eintrag kann nur von ${givers.join(", ")} geändert werden! \nFalls das du warst, kontrolliere deinen Namen oben in der Liste.`)

    const [giftId] = ownGift
    if (confirm("Möchtest du deine Zusage wirklich zurückziehen?"))
      removeGift(listId, entryId, giftId)
        .then(() => forgetGift(giftId))
        .catch(() => alert("Zusage konnte nicht entfernt werden."))
  }

  const handleSelect = (selected: boolean) => {

    if (!selected && gifts.length) return handleRemoveOwnGift()

    if (!selected) {
      if (entry?.taken?.giver && entry?.taken?.giver.trim() !== userName?.trim())
        return alert(`Dieser Eintrag kann nur von ${entry?.taken?.giver} geändert werden! \nFalls das du warst, kontrolliere deinen Namen oben in der Liste.`)

      if (confirm("Bist du sicher, dass du diesen Eintrag wirklich wieder freigeben möchtest?"))
        unpickEntry(listId, entryId).catch(() => alert("Eintrag konnte nicht freigegeben werden."))

      return
    }

    pickEntry(listId, entryId, userName)
      .then((committed) => {
        if (!committed) alert("Dieser Eintrag wurde bereits von jemand anderem vergeben.")
      })
      .catch(() => alert("Eintrag konnte nicht ausgewählt werden."))
  }


  return (
    <div className={`${styles.row} ${isTaken ? styles.taken : ""}`}>
      <input
        className={styles.input}
        id={entryId}
        type="checkbox"
        checked={isTaken}
        readOnly
        onClick={({ currentTarget: { checked } }) => handleSelect(checked)}
      />
      <label className={styles.label} htmlFor={entryId}>
        <span className={styles.text}>{entry?.text}</span>
        {isTaken
          ? (<span className={styles.giver}><Gift size={12} aria-hidden /> schenkt {givers.join(", ")}</span>)
          : null}
      </label>
      {entry?.link ?
        <a href={entry.link} target="_blank" rel="noreferrer" className={styles.share} title="Link öffnen">
          <ExternalLink size={16} />
        </a>
        : null}
      <span className={styles.priority}>
        <PriorityIcon priority={entry?.priority} />
      </span>
    </div>
  )
}

export default ChecklistEntry

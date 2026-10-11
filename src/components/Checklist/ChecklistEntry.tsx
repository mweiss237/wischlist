import { useDialog } from "components/Dialog/Dialog"
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
  const dialog = useDialog()

  const userName = user?.displayName || giverName
  const isTaken = isEntryClosed(entry)
  // a former multi entry keeps its gifts and counts as taken by all of them
  const gifts = entry?.taken ? [] : getGifts(entry)
  const givers = entry?.taken
    ? [entry.taken.giver || "jemand"]
    : gifts.map(([, gift]) => gift.giver || "jemand")

  const alertNotOwn = (owners: string) => dialog.alert(
    `Dieser Eintrag kann nur von ${owners} geändert werden.\nFalls das du warst, kontrolliere deinen Namen oben in der Liste.`,
    { title: "Nicht deine Zusage" }
  )

  const handleRemoveOwnGift = async () => {
    const ownGift = gifts.find((gift) => isOwnGift(gift, ownGiftIds, userName))
    if (!ownGift) return alertNotOwn(givers.join(", "))

    const [giftId] = ownGift
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

  const handleSelect = async (selected: boolean) => {

    if (!selected && gifts.length) return handleRemoveOwnGift()

    if (!selected) {
      if (entry?.taken?.giver && entry?.taken?.giver.trim() !== userName?.trim())
        return alertNotOwn(entry.taken.giver)

      const confirmed = await dialog.confirm("Der Wunsch ist danach wieder für andere frei.", {
        title: "Eintrag wieder freigeben?",
        confirmLabel: "Freigeben",
        danger: true,
      })
      if (confirmed)
        unpickEntry(listId, entryId).catch(() => dialog.alert("Eintrag konnte nicht freigegeben werden.", { title: "Hoppla" }))

      return
    }

    pickEntry(listId, entryId, userName)
      .then((committed) => {
        if (!committed) dialog.alert("Dieser Eintrag wurde bereits von jemand anderem vergeben.", { title: "Schon vergeben" })
      })
      .catch(() => dialog.alert("Eintrag konnte nicht ausgewählt werden.", { title: "Hoppla" }))
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

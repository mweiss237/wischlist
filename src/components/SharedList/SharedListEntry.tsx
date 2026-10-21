import { useDialog } from "components/Dialog/Dialog"
import InlinePrompt from "components/InlinePrompt/InlinePrompt"
import { useUser } from "lib/auth"
import React from "react"
import { pickEntry, removeGift, unpickEntry } from "lib/entries"
import { useGiver } from "lib/giver"
import { getGifts, isEntryClosed, isOwnGift } from "lib/gifts"
import { ExternalLink } from "react-feather"
import { Entry } from "types"
import { DoodleCheck } from "components/Doodle/Doodle"
import styles from "./SharedListEntry.module.scss"
import PriorityTape from "./Priority"

interface SharedListEntryParams {
  entry: Entry
  entryId: string
  listId: string
}

const SharedListEntry = ({ entry, entryId, listId }: SharedListEntryParams) => {

  const { giverName, setName, hasSkipped, skip, ownGiftIds, forgetGift } = useGiver()
  const { user } = useUser()
  const dialog = useDialog()
  // asks an anonymous giver for a name right below the wish before reserving it
  const [isAskingName, setAskingName] = React.useState(false)

  const userName = user?.displayName || giverName
  const needsName = !user && !giverName?.trim() && !hasSkipped
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

    if (needsName) return setAskingName(true)

    reserve(userName)
  }

  const reserve = (giver: string | null) =>
    pickEntry(listId, entryId, giver)
      .then((committed) => {
        if (!committed) dialog.alert("Dieser Eintrag wurde bereits von jemand anderem vergeben.", { title: "Schon vergeben" })
      })
      .catch(() => dialog.alert("Eintrag konnte nicht ausgewählt werden.", { title: "Hoppla" }))

  const handleNameSubmit = (name: string) => {
    setAskingName(false)
    if (name) setName(name)
    else skip()
    reserve(name || null)
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
      {/* the label spans the row, so the whole line toggles */}
      <label className={styles.label} htmlFor={entryId}>
        <span className={styles.box} aria-hidden>
          <DoodleCheck className={styles.check} />
        </span>
        <span className={styles.text}>{entry?.text}</span>
        {isTaken
          ? (<span className={styles.tag}>von {givers.join(", ")}</span>)
          : null}
      </label>
      {entry?.link ?
        <a href={entry.link} target="_blank" rel="noreferrer" className={styles.share} title="Link öffnen">
          <ExternalLink size={18} />
          <span className="sr_only">Link öffnen</span>
        </a>
        : null}
      <PriorityTape priority={entry?.priority} className={styles.priority} />
      {isAskingName && !isTaken ? (
        <InlinePrompt
          className={styles.namePrompt}
          label="Unter welchem Namen schenkst du?"
          hint="Leer lassen, um anonym zu schenken."
          placeholder="Dein Name"
          maxLength={100}
          submitLabel="Reservieren"
          allowEmpty
          onSubmit={handleNameSubmit}
          onCancel={() => setAskingName(false)}
        />
      ) : null}
    </div>
  )
}

export default SharedListEntry

import { useDialog } from "components/Dialog/Dialog"
import InlinePrompt from "components/InlinePrompt/InlinePrompt"
import { useUser } from "lib/auth"
import React from "react"
import { addGift, removeGift } from "lib/entries"
import { useGiver } from "lib/giver"
import { getGifts, isOwnGift, NOTE_MAX_LENGTH } from "lib/gifts"
import { ExternalLink, Plus, X } from "react-feather"
import { Entry } from "types"
import { DoodleCheck } from "components/Doodle/Doodle"
import entryStyles from "./SharedListEntry.module.scss"
import styles from "./SharedListMultiEntry.module.scss"
import PriorityTape from "./Priority"

interface SharedListMultiEntryParams {
  entry: Entry
  entryId: string
  listId: string
}

// a "Dauerbrenner": stays open, every giver is listed below with an optional note
const SharedListMultiEntry = ({ entry, entryId, listId }: SharedListMultiEntryParams) => {

  const { giverName, setName, hasSkipped, skip, ownGiftIds, rememberGift, forgetGift } = useGiver()
  const { user } = useUser()
  const dialog = useDialog()

  const userName = user?.displayName || giverName
  const needsName = !user && !giverName?.trim() && !hasSkipped
  const gifts = getGifts(entry)
  const ownGifts = gifts.filter((gift) => isOwnGift(gift, ownGiftIds, userName))
  const hasOwnGift = ownGifts.length > 0
  // anonymous givers without a name can't be told apart, so they may commit several times
  const canAdd = !hasOwnGift || !userName?.trim()
  // asks for a missing name and then the note right below the entry before the gift is saved
  const [step, setStep] = React.useState<"name" | "note" | null>(null)
  // the context name may still be stale in the render right after the name step
  const [pendingName, setPendingName] = React.useState<string | null>(null)

  const startAdding = () => setStep(needsName ? "name" : "note")

  const handleName = (name: string) => {
    if (name) setName(name)
    else skip()
    setPendingName(name)
    setStep("note")
  }

  const handleAdd = (note: string) => {
    setStep(null)

    const giver = pendingName ?? userName
    setPendingName(null)
    const giftRef = addGift(listId, entryId, giver?.trim() || null, note.slice(0, NOTE_MAX_LENGTH))
    const giftId = giftRef.key
    if (giftId) rememberGift(giftId)

    giftRef.catch(() => {
      if (giftId) forgetGift(giftId)
      dialog.alert("Du konntest nicht eingetragen werden.", { title: "Hoppla" })
    })
  }

  const cancelAdding = () => {
    setStep(null)
    setPendingName(null)
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
    if (!hasOwnGift) return step ? cancelAdding() : startAdding()
    // with several own gifts the latest one is withdrawn
    handleRemove(ownGifts[ownGifts.length - 1][0])
  }

  return (
    <div className={`${styles.wrapper} ${hasOwnGift ? entryStyles.taken : ""}`}>
      <div className={styles.head}>
        {/* the whole line toggles, like a regular row */}
        <button
          type="button"
          className={styles.toggle}
          onClick={handleToggle}
          aria-pressed={hasOwnGift}
          title={hasOwnGift ? "Zusage zurückziehen" : "Ich schenke etwas davon"}
        >
          <span className={`${entryStyles.box} ${styles.box}`} aria-hidden>
            {hasOwnGift ? <DoodleCheck draw className={entryStyles.check} /> : <Plus size={16} strokeWidth={2.5} />}
          </span>
          <span className={styles.text}>{entry?.text}</span>
          <span className={styles.multi} title="Mehrere können diesen Wunsch schenken">mehrfach</span>
        </button>
        {entry?.link ?
          <a href={entry.link} target="_blank" rel="noreferrer" className={entryStyles.share} title="Link öffnen">
            <ExternalLink size={18} />
            <span className="sr_only">Link öffnen</span>
          </a>
          : null}
        <PriorityTape priority={entry?.priority} className={entryStyles.priority} />
      </div>

      {/* every commitment hangs on the twine as a gift tag */}
      <ul className={styles.gifts}>
        {gifts.map((gift) => {
          const [giftId, { giver, note }] = gift
          const isOwn = isOwnGift(gift, ownGiftIds, userName)

          return (
            <li key={giftId} className={styles.gift}>
              <span className={entryStyles.tag}>
                {giver || "jemand"}{isOwn ? " (du)" : ""}
                {note ? <span className={styles.note}>: „{note}“</span> : null}
              </span>
              {isOwn ? (
                <button
                  type="button"
                  className={styles.remove}
                  onClick={() => handleRemove(giftId)}
                  title="Zusage zurückziehen"
                >
                  <X size={16} />
                  <span className="sr_only">Zusage zurückziehen</span>
                </button>
              ) : null}
            </li>
          )
        })}
        {canAdd && step === "name" ? (
          <li className={styles.prompt}>
            <InlinePrompt
              key="name"
              label="Unter welchem Namen schenkst du?"
              hint="Leer lassen, um anonym zu schenken."
              placeholder="Dein Name"
              maxLength={100}
              submitLabel="Weiter"
              allowEmpty
              onSubmit={handleName}
              onCancel={cancelAdding}
            />
          </li>
        ) : canAdd && step === "note" ? (
          <li className={styles.prompt}>
            <InlinePrompt
              key="note"
              label="Was genau schenkst du?"
              hint="Das sehen nur andere Schenkende, damit nichts doppelt kommt. Leer lassen ist auch okay."
              placeholder="z. B. Band 3"
              maxLength={NOTE_MAX_LENGTH}
              submitLabel="Eintragen"
              allowEmpty
              onSubmit={handleAdd}
              onCancel={cancelAdding}
            />
          </li>
        ) : canAdd ? (
          <li>
            <button type="button" className={styles.add} onClick={startAdding}>
              <Plus size={14} aria-hidden />
              {gifts.length ? "Ich schenke auch etwas davon" : "Ich schenke etwas davon"}
            </button>
          </li>
        ) : null}
      </ul>
    </div>
  )
}

export default SharedListMultiEntry

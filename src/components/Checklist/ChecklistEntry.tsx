import { useEntry } from "lib/entries"
import { useGiver } from "lib/giver"
import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
import styles from "./ChecklistEntry.module.scss"
import PriorityIcon from "./Priority"

interface ChecklistEntryParams {
  entryId: string
  listId: string
}

const ChecklistEntry = ({ entryId, listId }: ChecklistEntryParams) => {
  const { entry, pick, unpick } = useEntry(listId, entryId)

  const [value, setValue] = useState<boolean>(false)
  const { giverName } = useGiver()

  useEffect(() => {
    setValue(entry?.taken !== undefined)
  }, [entry?.taken])

  const handleSelect = useCallback((selected: boolean) => {
    setValue(!selected)

    if (!selected) {
      if (confirm("Möchtest du den Eintrag wirklich wieder freigeben?"))
        unpick()

      return
    }

    return pick(giverName)
  }, [unpick, pick, giverName])


  return (
    <span style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
      <span style={{ display: "flex", flex: 1, flexDirection: "row" }}>
        <input
          className={styles.input}
          id={entryId}
          type="checkbox"
          checked={value}
          onClick={({ currentTarget: { checked } }) => handleSelect(checked)}
        />
        <label className={styles.label} htmlFor={entryId}>
          {entry?.text}
        </label>
        {entry?.taken !== undefined
          ? (<span className={styles.giver}>(schenkt {entry.taken.giver || "jemand"})</span>)
          : null}
      </span>
      {entry?.link ? <a href={entry.link} target="_blank" rel="noreferrer" className={styles.share}>
        <Image
          src={"/external_link.svg"}
          alt="Link öffnen"
          height={20}
          width={20}
          unoptimized
          loading="lazy"
        /></a>
        : null}
      <PriorityIcon priority={entry?.priority} />

    </span >
  )
}

export default ChecklistEntry

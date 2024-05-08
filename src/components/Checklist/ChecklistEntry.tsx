import { useEntry } from "lib/entries"
import { useGiver } from "lib/giver"
import { useCallback, useEffect, useState } from "react"
import styles from "./ChecklistEntry.module.scss"

interface ChecklistEntryParams {
  entryId: string
  listId: string
}

const ChecklistEntry = ({ entryId, listId }: ChecklistEntryParams) => {
  const { entry, pick, unpick } = useEntry(listId, entryId)

  const [value, setValue] = useState<boolean>(false)
  const { giverName } = useGiver()

  console.log(giverName)

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
    <span style={{ display: "flex" }}>
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
    </span >
  )
}

export default ChecklistEntry

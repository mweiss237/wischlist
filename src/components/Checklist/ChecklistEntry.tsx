import { useUser } from "lib/auth"
import { useEntry } from "lib/entries"
import { useGiver } from "lib/giver"
import { useCallback, useEffect, useState } from "react"
import { Link } from "react-feather"
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
  const { user } = useUser()

  const userName = user?.displayName || giverName

  useEffect(() => {
    setValue(entry?.taken !== undefined)
  }, [entry?.taken])

  const handleSelect = useCallback((selected: boolean) => {
    setValue(!selected)

    if (!selected) {
      if (entry?.taken?.giver && entry?.taken?.giver.trim() !== userName?.trim())
        return alert(`Dieser Eintrag kann nur von ${entry?.taken?.giver} geändert werden! \nFalls das du warst, kontrolliere deinen Namen oben in der Liste.`)

      if (confirm("Bist du sicher, dass du diesen Eintrag wirklich wieder freigeben möchtest?"))
        unpick()

      return
    }

    return pick(userName)
  }, [unpick, pick, userName])


  return (
    <span style={{ display: "flex", flexDirection: "row", justifyContent: "center", gap: ".5rem" }}>
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
      {entry?.link ?
        <a href={entry.link} target="_blank" rel="noreferrer" className={styles.share}>
          <Link />
        </a>
        : null}
      <PriorityIcon priority={entry?.priority} />

    </span >
  )
}

export default ChecklistEntry

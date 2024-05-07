import { useState } from "react"

import styles from "./Checklist.module.scss"
import ChecklistEntry from "./ChecklistEntry"
import { Indie_Flower } from "@next/font/google"
import { useEntries } from "lib/entries"



const indieFlower = Indie_Flower({ weight: "400", subsets: ["latin"] })

interface ChecklistParams {
  params: {
    listId: string
  }
}

const Checklist = ({ params }: ChecklistParams) => {
  const { listId } = params
  const { entries } = useEntries(listId)


  return (
    <>
      <h1
        className={`crit_header_title ${styles.headline} ${indieFlower.className}`}
      >
        Ich wünsche mir...
      </h1>
      <div className={styles.checklist_wrapper}>
        <div className={styles.checklist}>
          {entries && Object.keys(entries).map((entryId) => {
            const entry = entries[entryId]
            return (
              <ChecklistEntry
                id={entryId}
                title={entry.text}
                key={`wish${entryId}`}
              />
            )
          })}
        </div>
      </div>
    </>
  )
}

export default Checklist

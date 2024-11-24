"use client"

import React from 'react'
import styles from "./Checklist.module.scss"
import ChecklistEntry from "./ChecklistEntry"
import { Indie_Flower } from "next/font/google"
import { useEntries } from "lib/entries"
import { useGiver } from "lib/giver"
import Loading from "components/Loading/Loading"
import { useList } from "lib/list"
import PriorityIcon from './Priority'
import { Priority } from 'types'
import { useUser } from 'lib/auth'
import Favorite from './Favorite'
import { useFavorites } from 'lib/favorite'




const indieFlower = Indie_Flower({ weight: "400", subsets: ["latin"] })

interface ChecklistParams {
  params: {
    listId: string
  }
}

const SORT_TO_THE_END = 0

const Checklist = ({ params }: ChecklistParams) => {
  const { listId } = params
  const { entries } = useEntries(listId)
  const { list } = useList(listId)
  const { giverName, setName } = useGiver()
  const { user } = useUser()
  const { checkIsFavorite, addFavorite, removeFavorite } = useFavorites()

  const isListOwner = !!list?.userId && !!user?.uid && list.userId === user.uid
  const isSomeTaken = Object.values(entries || {}).some(entry => !!entry.taken?.timestamp)

  const isBlurred = isListOwner && isSomeTaken

  const isFavorite = checkIsFavorite(listId)


  React.useEffect(() => {
    if (giverName === null) {
      const name = prompt("Möchtest du deinen Namen hinterlegen?")
      setName(name || "")
    }
  }, [giverName, setName])

  const sortedEntryIds = React.useMemo(() =>
    entries
      ? Object.keys(entries || {}).sort((a, b) =>
        (entries[a].position || SORT_TO_THE_END) - (entries[b].position || SORT_TO_THE_END)
      )
      : [],
    [entries]
  )

  return (
    <>
      <h1
        className={`crit_header_title ${styles.headline} ${indieFlower.className}`}
      >
        Ich wünsche mir...
      </h1>
      <div className={styles.giverWrapper}>
        <p className={styles.info}>
          Wenn du möchtest, kannst du hier deinen Namen eintragen,
          um anderen zu zeigen, was du schenkst:
        </p>
        <span>

          <span>Ich bin </span>
          <input type="text" className="crit_textinput" placeholder="anonym" value={giverName || ""} onChange={(event) => setName(event.currentTarget.value)} />
        </span>

        <p className={styles.info}>
          Mit den folgenden Symbolen werden Wunschprioritäten dargestellt:
          <br />
          <PriorityIcon priority={Priority.high} /> Hoch
          <br />
          <PriorityIcon priority={Priority.medium} /> Mittel
          <br />
          <PriorityIcon priority={Priority.low} /> Niedrig

        </p>

      </div>
      <div className={styles.checklist_wrapper}>
        <div className={`${styles.checklist} ${isBlurred && styles.blurry}`}>
          {!entries || !list ? <Loading className={styles.centered} /> :
            <>
              <div className='d-flex'>
                <h3 className={`${indieFlower.className} ${styles.headline} ${styles.invertColor}`}>{list?.title}</h3>
                <Favorite isFavorite={isFavorite} setIsFavorite={() => isFavorite ? removeFavorite(listId) : addFavorite(listId, list?.title)} />
              </div>
              {sortedEntryIds.map((entryId) => {
                return (
                  <ChecklistEntry
                    entryId={entryId}
                    listId={listId}
                    key={`wish${entryId}`}
                  />
                )
              })}
            </>
          }

        </div>
      </div>
    </>
  )
}

export default Checklist

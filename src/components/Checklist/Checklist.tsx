import React from 'react'
import styles from "./Checklist.module.scss"
import ChecklistEntry from "./ChecklistEntry"
import { Indie_Flower } from "@next/font/google"
import { useEntries } from "lib/entries"
import { useGiver } from "lib/giver"
import Loading from "components/Loading/Loading"
import { useList } from "lib/list"




const indieFlower = Indie_Flower({ weight: "400", subsets: ["latin"] })

interface ChecklistParams {
  params: {
    listId: string
  }
}

const Checklist = ({ params }: ChecklistParams) => {
  const { listId } = params
  const { entries } = useEntries(listId)
  const { list } = useList(listId)
  const { giverName, setName, removeName } = useGiver()


  const handleName = () => {

    if (!giverName) {
      const newName = prompt("Möchtest du deinen Namen hinterlegen?")
      if (newName) {
        setName(newName)
      }
      return
    }


    if (confirm("Möchtest du den Namen löschen?"))
      return removeName()

  }

  React.useEffect(() => {
    if (giverName === null) {
      const name = prompt("Möchtest du deinen Namen hinterlegen?")
      setName(name || "")
    }
  }, [giverName, setName])

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
          <input type="text" className="crit_textinput" readOnly placeholder="anonym" value={giverName || ""} onClick={handleName} />
        </span>
      </div>
      <div className={styles.checklist_wrapper}>
        <div className={styles.checklist}>
          <h3 className={`${indieFlower.className} ${styles.headline} ${styles.invertColor}`}>{list?.title}</h3>
          {entries && Object.keys(entries).map((entryId) => {
            return (
              <ChecklistEntry
                entryId={entryId}
                listId={listId}
                key={`wish${entryId}`}
              />
            )
          })}
          {!entries ? <Loading className={styles.centered} /> : null}
        </div>
      </div>
    </>
  )
}

export default Checklist

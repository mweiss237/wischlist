"use client"

import { parseAndActivateLinks } from "lib/link"
import Image from "next/image"
import React from "react"
import styles from "./Card.module.scss"

type CardParams = {
  id: string
  value?: string
  onDelete: (id: string) => void
  onSave: (id: string, value: string) => void
}

const Card = ({ id, value = "", onDelete, onSave }: CardParams) => {
  const [pristine, setPristine] = React.useState(false)
  const [focussed, setFocussed] = React.useState(false)
  const [text, setText] = React.useState(value)
  const handler = {
    save: () => {
      onSave(id, text)
      setPristine(false)
      setFocussed(false)
    },
    change: (changedText: string) => {
      setPristine(text === changedText ? false : true)
      setText(changedText)
    },
    remove: () => {
      const doDelete = confirm("Eintrag von der Liste löschen?")
      if (doDelete) {
        onDelete(id)
      }
    },
  }
  return (
    <div className={styles.cardWrapper}>
      <button className={styles.deleteWish} onClick={handler.remove}>
        <Image
          src={"/close.svg"}
          fill
          unoptimized
          loading={"eager"}
          alt="Löschen"
        />
      </button>
      {focussed ? (
        <>
          <textarea
            onChange={({ target }) => handler.change(target.value)}
            className={styles.card}
            placeholder="Ich wünsche mir..."
            defaultValue={text}
          ></textarea>
          <button
            className={`${styles.saveWish} ${pristine ? styles.active : ""}`}
            onClick={handler.save}
          >
            <Image
              src={"/save.svg"}
              alt="Speichern"
              height={30}
              width={30}
              unoptimized
              loading="lazy"
            />
          </button>
        </>
      ) : (
        <>
          <span
            className={styles.card}
            dangerouslySetInnerHTML={{ __html: parseAndActivateLinks(value) }}
          ></span>
          <button
            className={`${styles.saveWish} ${styles.active}`}
            onClick={() => setFocussed(true)}
          >
            <Image
              src={"/edit.svg"}
              alt="Bearbeiten"
              height={30}
              width={30}
              unoptimized
              loading="eager"
            />
          </button>
        </>
      )}
    </div>
  )
}


export default Card

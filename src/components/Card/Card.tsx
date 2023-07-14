"use client"

import Image from "next/image"
import React from "react"
import styles from "./Card.module.scss"

type CardParams = {
  id: string
  value?: string
  onDelete: (id: string) => void
  onChange: (id: string, value: string) => void
  onSave: (id: string, value: string) => void
}

const Card = ({ id, value = "", onDelete, onChange, onSave }: CardParams) => {
  const [pristine, setPristine] = React.useState(false)
  const [focussed, setFocussed] = React.useState(false)
  const handler = {
    save: () => {
      onSave(id, value)
      setPristine(false)
      setFocussed(false)
    },
    change: (changedValue: string) => {
      setPristine(value === changedValue ? false : true)
      onChange(id, changedValue)
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
            onChange={({ target: { value } }) => handler.change(value)}
            className={styles.card}
            placeholder="Ich wünsche mir..."
            defaultValue={value}
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
            dangerouslySetInnerHTML={{ __html: parseText(value) }}
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

const parseText = (text: string) => {
  const urlRegex =
    /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/g
  return text.replaceAll(urlRegex, (substr) => {
    return `<a href="${substr}" target="_blank">${substr}</a>`
  })
}

export default Card

"use client"

import { parseAndActivateLinks } from "lib/link"
import Image from "next/image"
import React from "react"
import styles from "./Card.module.scss"

type CardParams = {
  id: string
  value?: string
  link?: string
  onDelete: (id: string) => void
  onSave: (id: string, value: string) => void
  onAddLink: (value: string) => void
}

const Card = ({ id, value = "", link, onDelete, onSave, onAddLink }: CardParams) => {
  const [pristine, setPristine] = React.useState(false)
  const [text, setText] = React.useState(value)
  const handler = {
    save: () => {
      onSave(id, text)
      setPristine(false)
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
    addLink: () => {
      const newLink = prompt("Füge hier einen Link ein: (leer lassen zum Löschen)")
      if (newLink !== null)
        onAddLink(newLink)
    }
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
      <button
        className={`${styles.link} ${link && styles.active}`}
        onClick={handler.addLink}
        title="Link hinzufügen"
      >
        <Image
          src={"/link.svg"}
          alt="Link hinzufügen"
          height={20}
          width={20}
          unoptimized
          loading="lazy"
        />
        <label>+</label>
      </button>
    </div>
  )
}


export default Card

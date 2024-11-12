"use client"

import Menu from "components/Menu/Menu"
import Image from "next/image"
import React from "react"
import { Priority } from "types"
import styles from "./Card.module.scss"
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type CardParams = {
  id: string
  value?: string
  link?: string
  priority?: Priority
  onDelete: (id: string) => void
  onSave: (id: string, value: string) => void
  onAddLink: (value: string) => void
  onSetPriority: (priority: Priority) => void
}

const Card = ({ id, value = "", link, priority, onDelete, onSave, onAddLink, onSetPriority }: CardParams) => {
  const [pristine, setPristine] = React.useState(false)
  const [dragable, setDragable] = React.useState(true)
  const [text, setText] = React.useState(value)
  const handler = {
    save: () => {
      onSave(id, text)
      setPristine(false)
      setDragable(true)
    },
    change: (changedText: string) => {
      setPristine(text === changedText ? false : true)
      setText(changedText)
    },
    remove: () => {
      if (!text) return onDelete(id)

      const doDelete = confirm("Eintrag von der Liste löschen?")
      if (doDelete) {
        onDelete(id)
      }
    },
  }

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const draggableStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  };


  const addLink = () => {
    const newLink = prompt("Füge hier einen Link ein: (leer lassen zum Löschen)")
    if (newLink !== null)
      onAddLink(newLink)
  }
  
  return (
    <div className={styles.cardWrapper} ref={setNodeRef} style={draggableStyle} {...attributes} {...dragable ? listeners : {}}>
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
        onFocus={() => setDragable(false)}
        className={styles.card}
        placeholder="Ich wünsche mir..."
        defaultValue={text}
        onBlur={handler.save}
      />
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
      <Menu entries={[
        {
          active: !!link,
          activeColor: "#5ac45a",
          iconSrc: "/link.svg",
          label: "Link hinzufügen",
          onClick: addLink
        },
        {
          active: priority === Priority.high,
          activeColor: "#ff6361",
          iconSrc: "/prio-high.svg",
          label: "Hoch",
          onClick: () => onSetPriority(Priority.high)
        },
        {
          active: priority === Priority.medium,
          activeColor: "#FF9100",
          iconSrc: "/prio-medium.svg",
          label: "Mittel",
          onClick: () => onSetPriority(Priority.medium)
        },
        {
          active: priority === Priority.low,
          activeColor: "#84E6E6",
          iconSrc: "/prio-low.svg",
          label: "Niedrig",
          onClick: () => onSetPriority(Priority.low)
        },
      ]} />
      {/* <button
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
      </button> */}
    </div>
  )
}


export default Card

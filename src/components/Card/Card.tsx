"use client"

import Menu from "components/Menu/Menu"
import React from "react"
import { Priority } from "types"
import styles from "./Card.module.scss"
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Check, ChevronDown, ChevronUp, Link, Minus, X } from "react-feather"

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
    const newLink = prompt("Füge hier einen Link ein: (leer lassen zum Löschen)", link)
    if (newLink !== null)
      onAddLink(newLink)
  }

  return (
    <div
      className={`${styles.cardWrapper} wish-card`}
      data-priority={priority}
      ref={setNodeRef}
      style={draggableStyle}
      {...attributes}
      {...dragable ? listeners : {}}
    >
      <button type="button" className={styles.deleteWish} onClick={handler.remove} title="Wunsch löschen">
        <X size={14} />
      </button>

      <textarea
        onChange={({ target }) => handler.change(target.value)}
        onFocus={() => setDragable(false)}
        className={styles.card}
        placeholder="Ich wünsche mir..."
        defaultValue={text}
        onBlur={handler.save}
      />
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className={styles.linkBadge}
          title={link}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <Link size={12} /> Link
        </a>
      ) : null}
      <button
        type="button"
        className={`${styles.saveWish} ${pristine ? styles.active : ""}`}
        onClick={handler.save}
        title="Speichern"
      >
        <Check size={16} />
      </button>
      <Menu entries={[
        {
          active: !!link,
          activeColor: "var(--primary)",
          Icon: <Link />,
          label: link ? "Link ändern" : "Link hinzufügen",
          onClick: addLink
        },
        {
          active: priority === Priority.high,
          activeColor: "var(--prio-high)",
          Icon: <ChevronUp />,
          label: "Priorität hoch",
          onClick: () => onSetPriority(Priority.high)
        },
        {
          active: priority === Priority.medium,
          activeColor: "var(--prio-medium)",
          Icon: <Minus />,
          label: "Priorität mittel",
          onClick: () => onSetPriority(Priority.medium)
        },
        {
          active: priority === Priority.low,
          activeColor: "var(--prio-low)",
          Icon: <ChevronDown />,
          label: "Priorität niedrig",
          onClick: () => onSetPriority(Priority.low)
        },
      ]} />
    </div>
  )
}


export default Card

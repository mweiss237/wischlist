"use client"

import { useDialog } from "components/Dialog/Dialog"
import InlinePrompt from "components/InlinePrompt/InlinePrompt"
import Menu from "components/Menu/Menu"
import React from "react"
import { Priority } from "types"
import styles from "./Card.module.scss"
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Check, ChevronDown, ChevronUp, Link, Minus, Users, X } from "react-feather"

type CardParams = {
  id: string
  value?: string
  link?: string
  priority?: Priority
  multi?: boolean
  onDelete: (id: string) => void
  onSave: (id: string, value: string) => void
  onAddLink: (value: string) => void
  onSetPriority: (priority: Priority) => void
  onToggleMulti: () => void
}

const Card = ({ id, value = "", link, priority, multi, onDelete, onSave, onAddLink, onSetPriority, onToggleMulti }: CardParams) => {
  const [pristine, setPristine] = React.useState(false)
  const [dragable, setDragable] = React.useState(true)
  const [text, setText] = React.useState(value)
  const dialog = useDialog()
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
    remove: async () => {
      if (!text) return onDelete(id)

      const doDelete = await dialog.confirm(`„${text}“ wird von der Liste entfernt.`, {
        title: "Wunsch löschen?",
        confirmLabel: "Löschen",
        danger: true,
      })
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


  const [isEditingLink, setEditingLink] = React.useState(false)

  const linkEditor = {
    open: () => {
      setEditingLink(true)
      setDragable(false)
    },
    close: () => {
      setEditingLink(false)
      setDragable(true)
    },
    save: (newLink: string) => {
      onAddLink(newLink)
      linkEditor.close()
    },
  }

  return (
    <div
      className={`${styles.cardWrapper} wish-card`}
      data-priority={priority}
      data-entry-id={id}
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
      {isEditingLink ? (
        <InlinePrompt
          className={styles.linkPrompt}
          label="Link zum Wunsch"
          hint={link ? "Leer speichern entfernt den Link." : undefined}
          placeholder="https://…"
          type="url"
          defaultValue={link}
          submitLabel="Link speichern"
          allowEmpty={!!link}
          compact
          onSubmit={linkEditor.save}
          onCancel={linkEditor.close}
        />
      ) : null}
      {(link || multi) && !isEditingLink ? (
        <div className={styles.badges}>
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
          {multi ? (
            <span className={styles.multiBadge} title="Mehrere können diesen Wunsch schenken">
              <Users size={12} /> Mehrfach
            </span>
          ) : null}
        </div>
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
          onClick: linkEditor.open,
          closesMenu: true
        },
        {
          active: !!multi,
          activeColor: "var(--gold)",
          Icon: <Users />,
          label: "Mehrfach schenkbar",
          onClick: onToggleMulti
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

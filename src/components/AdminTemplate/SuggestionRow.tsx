"use client"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import React, { useState } from "react"
import { Move, Trash2 } from "react-feather"
import { Priority, TemplateSuggestion } from "types"
import styles from "./AdminTemplate.module.scss"

interface SuggestionRowProps {
  id: string
  suggestion: TemplateSuggestion
  onSave: (changes: Partial<TemplateSuggestion>) => void
  onDelete: () => void
}

const toDraft = (suggestion: TemplateSuggestion) => ({
  text: suggestion.text,
  description: suggestion.description || "",
  link: suggestion.link || "",
})

// links have to be real URLs, the database rejects everything else
const normalizeLink = (link: string) => {
  const trimmed = link.trim()
  return trimmed && !/^https?:\/\//i.test(trimmed) ? `https://${trimmed}` : trimmed
}

// one idea as a row: fields save when they lose focus, the handle sorts the rows
const SuggestionRow = ({ id, suggestion, onSave, onDelete }: SuggestionRowProps) => {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id })
  const [draft, setDraft] = useState(() => toDraft(suggestion))

  // remote changes replace the draft, but only when a saved value really differs
  const savedKey = JSON.stringify(toDraft(suggestion))
  const [seenKey, setSeenKey] = useState(savedKey)
  if (seenKey !== savedKey) {
    setSeenKey(savedKey)
    setDraft(toDraft(suggestion))
  }

  const field = (name: keyof typeof draft) => ({
    value: draft[name],
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setDraft((previous) => ({ ...previous, [name]: event.target.value })),
  })

  const handleBlur = (name: keyof typeof draft) => {
    const saved = toDraft(suggestion)
    const value = name === "link" ? normalizeLink(draft.link) : draft[name].trim()
    if (value === saved[name]) {
      setDraft((previous) => ({ ...previous, [name]: saved[name] }))
      return
    }
    // an idea without a text makes no sense
    if (name === "text" && !value) {
      setDraft((previous) => ({ ...previous, text: saved.text }))
      return
    }
    setDraft((previous) => ({ ...previous, [name]: value }))
    onSave({ [name]: value })
  }

  return (
    <li
      ref={setNodeRef}
      className={`${styles.row} ${isDragging ? styles.dragging : ""}`}
      style={{ transform: CSS.Transform.toString(transform), transition }}
    >
      <button
        type="button"
        ref={setActivatorNodeRef}
        className={`btn btn-ghost btn-icon ${styles.handle}`}
        title="Verschieben"
        aria-label="Vorschlag verschieben"
        {...attributes}
        {...listeners}
      >
        <Move size={18} aria-hidden />
      </button>

      <div className={styles.fields}>
        <label className="field">
          <span className="field_key">Geschenk</span>
          <input
            type="text"
            className="crit_textinput"
            maxLength={200}
            {...field("text")}
            onBlur={() => handleBlur("text")}
          />
        </label>
        <label className="field">
          <span className="field_key">Warum unterschätzt?</span>
          <textarea
            className={`crit_textinput ${styles.textarea}`}
            rows={2}
            maxLength={300}
            {...field("description")}
            onBlur={() => handleBlur("description")}
          />
        </label>
        <div className={styles.pair}>
          <label className="field">
            <span className="field_key">Link</span>
            <input
              type="url"
              className="crit_textinput"
              placeholder="https://"
              maxLength={500}
              {...field("link")}
              onBlur={() => handleBlur("link")}
            />
          </label>
          <label className="field">
            <span className="field_key">Priorität</span>
            <select
              className={styles.select}
              value={suggestion.priority ?? ""}
              onChange={(event) =>
                onSave({ priority: event.target.value ? (Number(event.target.value) as Priority) : undefined })
              }
            >
              <option value="">Keine (wird mittel)</option>
              <option value={Priority.high}>Hoch</option>
              <option value={Priority.medium}>Mittel</option>
              <option value={Priority.low}>Niedrig</option>
            </select>
          </label>
        </div>
      </div>

      <button
        type="button"
        className="btn btn-ghost btn-icon btn-danger"
        title="Vorschlag löschen"
        aria-label="Vorschlag löschen"
        onClick={onDelete}
      >
        <Trash2 size={18} aria-hidden />
      </button>
    </li>
  )
}

export default SuggestionRow

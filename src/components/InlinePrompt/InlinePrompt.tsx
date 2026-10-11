"use client"

import React from "react"
import { Check, X } from "react-feather"
import styles from "./InlinePrompt.module.scss"

interface InlinePromptProps {
  label: string
  hint?: string
  placeholder?: string
  defaultValue?: string
  type?: "text" | "url"
  maxLength?: number
  submitLabel: string
  // an empty answer is valid, e.g. to remove a link
  allowEmpty?: boolean
  // icon-only buttons for tight spots like a wish card
  compact?: boolean
  className?: string
  onSubmit: (value: string) => void
  onCancel: () => void
}

// asks for text right where the action happened instead of in a browser dialog, Enter submits, Escape cancels
const InlinePrompt = ({
  label,
  hint,
  placeholder,
  defaultValue = "",
  type = "text",
  maxLength,
  submitLabel,
  allowEmpty = false,
  compact = false,
  className = "",
  onSubmit,
  onCancel,
}: InlinePromptProps) => {
  const [value, setValue] = React.useState(defaultValue)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const id = React.useId()
  const hintId = `${id}-hint`

  React.useEffect(() => {
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [])

  const canSubmit = allowEmpty || !!value.trim()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (canSubmit) onSubmit(value.trim())
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    // keeps keys away from parents, e.g. the keyboard sensor of a sortable card
    event.stopPropagation()
    if (event.key === "Escape") onCancel()
  }

  return (
    <form
      className={`${styles.prompt} ${compact ? styles.compact : ""} ${className}`}
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      onPointerDown={(event) => event.stopPropagation()}
      noValidate
    >
      <label htmlFor={id} className={styles.label}>{label}</label>
      {hint ? <p id={hintId} className={styles.hint}>{hint}</p> : null}
      <div className={styles.row}>
        <input
          ref={inputRef}
          id={id}
          type={type}
          className={styles.input}
          value={value}
          placeholder={placeholder}
          maxLength={maxLength}
          autoComplete="off"
          aria-describedby={hint ? hintId : undefined}
          onChange={(event) => setValue(event.currentTarget.value)}
        />
        <button
          type="submit"
          className={`btn btn-primary btn-sm ${styles.button}`}
          disabled={!canSubmit}
          title={submitLabel}
        >
          <Check size={16} aria-hidden />
          <span className={compact ? "sr_only" : undefined}>{submitLabel}</span>
        </button>
        <button
          type="button"
          className={`btn btn-ghost btn-sm ${styles.button}`}
          onClick={onCancel}
          title="Abbrechen"
        >
          <X size={16} aria-hidden />
          <span className="sr_only">Abbrechen</span>
        </button>
      </div>
    </form>
  )
}

export default InlinePrompt

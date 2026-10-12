import { DoodleArrow } from "components/Doodle/Doodle"
import React from "react"
import styles from "./EmptyState.module.scss"

interface EmptyStateProps {
  // one handwritten sentence
  text: string
  // exactly one button, the arrow points at it
  action?: React.ReactNode
}

const EmptyState = ({ text, action }: EmptyStateProps) => (
  <div className={styles.empty}>
    <p className={styles.text}>{text}</p>
    {action ? (
      <div className={styles.action}>
        <DoodleArrow draw className={styles.arrow} />
        {action}
      </div>
    ) : null}
  </div>
)

export default EmptyState

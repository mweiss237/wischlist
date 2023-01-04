import styles from "./ChecklistEntry.module.scss"

interface ChecklistEntryParams {
  id: string
  title: string
  checked?: boolean
}

const ChecklistEntry = (props: ChecklistEntryParams) => {
  return (
    <>
      <input
        className={styles.input}
        id={props.id}
        type="checkbox"
        value="1"
        defaultChecked={props.checked}
      />
      <label className={styles.label} htmlFor={props.id}>
        {props.title}
      </label>
    </>
  )
}

export default ChecklistEntry

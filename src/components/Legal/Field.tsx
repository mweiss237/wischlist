import styles from "./Legal.module.scss"

// Renders an operator value; unfilled placeholders like "[E-Mail-Adresse]" are highlighted
const Field = ({ value }: { value: string }) =>
  value.startsWith("[") ? <mark className={styles.todo}>{value}</mark> : <>{value}</>

export default Field

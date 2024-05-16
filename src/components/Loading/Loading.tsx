import styles from "./Loading.module.scss"


const Loading = ({className}: {className?: string}) => (
  <div className={`${styles["lds-heart"]} ${className || ""}`}>
    <div></div>
  </div>
)

export default Loading

import Image from "next/image"
import styles from "./DeleteTrashCan.module.scss"

interface DeleteTrashCanProps {
    onDelete: () => void
    
}

export const DeleteTrashCan = ({ onDelete }: DeleteTrashCanProps) => {
    return <button className={`crit_button ${styles.delete}`} onClick={onDelete}>
        <Image
            alt="Liste löschen"
            src="/trash.svg"
            width="20"
            height="20"
        />
    </button>
}
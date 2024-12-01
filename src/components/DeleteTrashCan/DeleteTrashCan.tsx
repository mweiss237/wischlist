import styles from "./DeleteTrashCan.module.scss"
import { Trash2 } from 'react-feather'

interface DeleteTrashCanProps {
    onDelete: () => void

}

export const DeleteTrashCan = ({ onDelete }: DeleteTrashCanProps) => {
    return <button className={`crit_button ${styles.delete}`} onClick={onDelete}>
        <Trash2 size={20} />
    </button>
}
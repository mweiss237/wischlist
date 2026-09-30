import { Trash2 } from 'react-feather'

interface DeleteTrashCanProps {
    onDelete: () => void

}

export const DeleteTrashCan = ({ onDelete }: DeleteTrashCanProps) => {
    return <button
        type="button"
        className="btn btn-ghost btn-icon btn-danger"
        onClick={onDelete}
        title="Liste löschen"
        aria-label="Liste löschen"
    >
        <Trash2 size={18} />
    </button>
}

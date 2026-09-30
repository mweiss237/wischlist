import React from "react"
import styles from "./Favorite.module.scss"
import { Star } from 'react-feather'

interface FavoriteProps {
    isFavorite?: boolean
    setIsFavorite: () => void
}


const Favorite = ({ isFavorite, setIsFavorite }: FavoriteProps) => (
    <button
        type="button"
        className={`${styles.button} ${isFavorite ? styles.active : ""}`}
        onClick={setIsFavorite}
        title={isFavorite ? "Aus Favoriten entfernen" : "Als Favorit merken"}
        aria-pressed={!!isFavorite}
    >
        <Star size={18} />
    </button>
)


export default Favorite

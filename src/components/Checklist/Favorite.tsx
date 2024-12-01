import React from "react"
import styles from "./Favorite.module.scss"
import { Star } from 'react-feather'

interface FavoriteProps {
    isFavorite?: boolean
    setIsFavorite: () => void
}


const Favorite = ({ isFavorite, setIsFavorite }: FavoriteProps) => (
    <button className={styles.button} onClick={setIsFavorite}>
        <Star color="#FFB91D" fill={isFavorite ? "#FFB91D" : "#fff"} size={20} />
    </button>
)


export default Favorite

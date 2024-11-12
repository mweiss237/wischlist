import { useRouter } from "next/navigation"
import React from "react"
import { useList } from "./list"
import useLocalStorage from "./localStorage"

interface FavoriteList {
    listId: string
    title: string
}

const LOCAL_STORAGE_KEY = "favorites"
export function useFavorites() {
    const { refresh } = useRouter()

    const [favorites, setFavorites] = useLocalStorage<FavoriteList[]>(LOCAL_STORAGE_KEY, [])

    const isFavorite = React.useCallback((listId: string) => favorites && favorites.some(entry => entry.listId === listId), [favorites])

    const toggle = React.useCallback((listId: string, title?: string) => {

        if (isFavorite(listId)) {
            setFavorites(favorites.filter(entry => entry.listId !== listId))
        } else {
            favorites.push({ listId, title: title || "" })
            setFavorites(favorites)
        }

        refresh()
    }, [isFavorite, favorites, refresh])

    return {
        favorites,
        isFavorite,
        checkFavorite: (id: string) => favorites.some(entry => entry.listId === id),
        toggle,
    }

} 
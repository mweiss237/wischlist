import { ref, onValue, set, remove } from "firebase/database"
import { useCallback, useEffect, useState } from "react";
import { Favorite } from "types";
import { useUser } from "./auth";
import { database } from "./firebase"

export const useFavorites = () => {

    const [favorites, setFavorites] = useState<Record<string, Favorite> | null>(null)

    const { user } = useUser()
    const userId = user?.uid

    useEffect(() => {
        setFavorites(null)
        if (!userId) return
        const path = `favorites/${userId}`
        const unsubscriber = onValue(
            ref(database, path),
            (snapshot) => setFavorites(snapshot.val()),
            (error) => console.error(`[rtdb] ${path}`, error)
        );

        return unsubscriber
    }, [userId])

    const addFavorite = useCallback((listId: string, title: string) => {
        if (!userId) return
        set(ref(database, `favorites/${userId}/${listId}`), { title });
    }, [userId])

    const removeFavorite = useCallback((listId: string) => {
        if (!userId) return
        remove(ref(database, `favorites/${userId}/${listId}`));
    }, [userId])

    const checkIsFavorite = (listId: string) => !!favorites && Object.keys(favorites).some(key => key === listId)

    return { favorites, addFavorite, removeFavorite, checkIsFavorite }
}

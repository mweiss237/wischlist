import { ref, onValue, push, child, set, remove, query, equalTo, orderByChild } from "firebase/database"
import { useCallback, useEffect, useState } from "react";
import { Favorite } from "types";
import { useUser } from "./auth";
import { database } from "./firebase"

export const useFavorites = () => {

    const [favorites, setFavorites] = useState<Record<string, Favorite> | null>(null)

    const { user } = useUser()
    const userId = user?.uid

    useEffect(() => {
        if (!userId) return
        const favoritesRef = query(ref(database, `favorites/${userId}`));
        const unsubscriber = onValue(favoritesRef, (snapshot) => {
            const data = snapshot.val();
            console.log(data)
            setFavorites(data)
        });

        return unsubscriber
    }, [userId, database])

    const addFavorite = useCallback((listId: string, title: string) => {
        set(child(ref(database), `favorites/${userId}/${listId}`), { title });
    }, [userId, database])

    const removeFavorite = useCallback((listId: string) => {
        remove(ref(database, `favorites/${userId}/${listId}`));
    }, [userId, database])

    const checkIsFavorite = (listId: string) => !!favorites && Object.keys(favorites).some(key => key === listId)

    return { favorites, addFavorite, removeFavorite, checkIsFavorite }
}
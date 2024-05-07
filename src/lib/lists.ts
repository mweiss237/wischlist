import { ref, onValue, push, child } from "firebase/database"
import { useCallback, useEffect, useState } from "react";
import { List } from "types";
import { useAuth } from "./auth";
import { database } from "./firebase"

export const useLists = () => {

    const [lists, setLists] = useState<Record<string, List> | null>(null)

    const { user } = useAuth()
    const userId = user?.uid

    useEffect(() => {
        const listsRef = ref(database, `lists/${userId}`);
        const unsubscriber = onValue(listsRef, (snapshot) => {
            const data = snapshot.val();
            setLists(data)
        });

        return unsubscriber
    }, [userId, database])

    const addList = useCallback((listName: string) => {
        push(child(ref(database), `lists/${userId}`), {
            title: listName,
        });
    }, [userId, database])

    return { lists, addList }
}
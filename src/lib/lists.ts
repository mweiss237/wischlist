import { ref, onValue, push, child, remove, query, equalTo, orderByChild } from "firebase/database"
import { useCallback, useEffect, useState } from "react";
import { List } from "types";
import { useUser } from "./auth";
import { database } from "./firebase"

export const useLists = () => {

    const [lists, setLists] = useState<Record<string, List> | null>(null)

    const { user } = useUser()
    const userId = user?.uid

    useEffect(() => {
        if (!userId) return
        const listsRef = query(ref(database, `lists`), ...[orderByChild("userId"), equalTo(userId)]);
        const unsubscriber = onValue(listsRef, (snapshot) => {
            const data = snapshot.val();
            setLists(data)
        });

        return unsubscriber
    }, [userId])

    const addList = useCallback((listName: string) => {
        push(child(ref(database), `lists`), {
            title: listName,
            userId,
            options: {
                blurForOwner: false,
                isShared: false
            }
        });
    }, [userId])

    const removeList = useCallback((listId: string) => {
        remove(ref(database, `lists/${listId}`));
    }, [])

    return { lists, addList, removeList }
}
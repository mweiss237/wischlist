import { ref, onValue, push, child, query, equalTo, orderByChild } from "firebase/database"
import { useCallback, useEffect, useState } from "react";
import { List } from "types";
import { useUser } from "./auth";
import { database } from "./firebase"
import { deleteListWithEntries } from "./list";

export const useLists = () => {

    const [lists, setLists] = useState<Record<string, List> | null>(null)

    const { user } = useUser()
    const userId = user?.uid

    useEffect(() => {
        setLists(null)
        if (!userId) return
        const listsRef = query(ref(database, `lists`), orderByChild("userId"), equalTo(userId));
        const unsubscriber = onValue(
            listsRef,
            (snapshot) => setLists(snapshot.val()),
            (error) => console.error("[rtdb] lists", error)
        );

        return unsubscriber
    }, [userId])

    const addList = useCallback((listName: string) => {
        if (!userId) return
        push(child(ref(database), `lists`), {
            title: listName,
            userId,
            options: {
                blurForOwner: false,
                isShared: false
            }
        });
    }, [userId])

    const removeList = useCallback((listId: string) => deleteListWithEntries(listId), [])

    return { lists, addList, removeList }
}

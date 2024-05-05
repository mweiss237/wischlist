import { ref, set, onValue, update, push, child, } from "firebase/database"
import { useCallback, useEffect, useState } from "react";
import { List } from "types";
import { useAuth } from "./auth";
import { database } from "./firebase"

export const useLists = () => {

    const [lists, setLists] = useState<List[] | null>(null)

    const { user } = useAuth()
    const userId = user?.uid

    useEffect(() => {
        debugger
        if (lists) return

        const listsRef = ref(database, `lists/${userId}`);
        onValue(listsRef, (snapshot) => {
            const data = snapshot.val();
            setLists(data)
        });
    }, [userId, lists, database])

    const addList = useCallback((listName: string) => {
        push(child(ref(database), `lists/${userId}`), {
            title: listName,
            user: userId,
        });
    }, [userId, database])

    return { lists, addList }
}
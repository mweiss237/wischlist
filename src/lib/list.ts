import { child, onValue, push, ref, remove } from "firebase/database"
import { useCallback, useEffect, useState } from "react"
import { List } from "types"
import { database } from "./firebase"


const PATH = "list"

export const useList = (listId: string) => {
    const [entries, setList] = useState<List | null>(null)

    useEffect(() => {
        if (entries) return

        const listRef = ref(database, `${PATH}/${listId}`);
        onValue(listRef, (snapshot) => {
            const data = snapshot.val();
            setList(data)
        });
    }, [entries, database])

    const addEntry = useCallback((text: string) =>
        push(child(ref(database), `${PATH}/${listId}`), {
            text,
            link: null,
        })
        , [database])

    const removeEntry = useCallback((entryId: string) =>
        remove(child(ref(database), `${PATH}/${listId}/${entryId}`))
        , [])

    return { entries, addEntry, removeEntry }

}

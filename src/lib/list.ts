import { child, onValue, push, ref, remove } from "firebase/database"
import { useCallback, useEffect, useState } from "react"
import { List } from "types"
import { database } from "./firebase"


const PATH = "list"

export const useList = (listId: string) => {
    const [entries, setList] = useState<List | null>(null)

    useEffect(() => {

        const listRef = ref(database, `${PATH}/${listId}`);
        const unsubscriber = onValue(listRef, (snapshot) => {
            const data = snapshot.val();
            setList(data)
        });

        return unsubscriber
    }, [database, PATH])

    const addEntry = useCallback((text: string) =>
        push(child(ref(database), `${PATH}/${listId}`), {
            text,
            link: null,
        })
        , [database, listId, PATH])

    const removeEntry = useCallback((entryId: string) =>
        remove(child(ref(database), `${PATH}/${listId}/${entryId}`))
        , [database, listId, PATH])

    return { entries, addEntry, removeEntry }

}

import { onValue, ref, remove, update } from "firebase/database"
import { useCallback, useEffect, useState } from "react"
import { List } from "types"
import { database } from "./firebase"


const PATH = "lists"

export const useList = (listId: string) => {
    const [list, setList] = useState<List | null>(null)

    useEffect(() => {

        const listRef = ref(database, `${PATH}/${listId}`);
        const unsubscriber = onValue(listRef, (snapshot) => {
            const data = snapshot.val();
            setList(data)
        });

        return unsubscriber
    }, [database, listId, PATH])

    const updateListTitle = useCallback((title: string) =>
        update(ref(database, `${PATH}/${listId}`), {
            title,
        })
        , [database, listId, PATH])

    const deleteList = useCallback(() => {
        remove(ref(database, `${PATH}/${listId}`))
    }, [])

    return { list, updateListTitle, deleteList }

}

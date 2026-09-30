import { onValue, ref, update } from "firebase/database"
import { useCallback, useEffect, useState } from "react"
import { List, ListOptions } from "types"
import { database } from "./firebase"


const PATH = "lists"

/** Removes the list and its entries in one atomic multi-path update. */
export const deleteListWithEntries = (listId: string) =>
    update(ref(database), {
        [`${PATH}/${listId}`]: null,
        [`entries/${listId}`]: null,
    })

export const useList = (listId: string) => {
    const [list, setList] = useState<List | null>(null)

    useEffect(() => {
        setList(null)
        const path = `${PATH}/${listId}`
        const unsubscriber = onValue(
            ref(database, path),
            (snapshot) => setList(snapshot.val()),
            (error) => console.error(`[rtdb] ${path}`, error)
        );

        return unsubscriber
    }, [listId])

    const updateListTitle = useCallback((title: string) =>
        update(ref(database, `${PATH}/${listId}`), {
            title,
        })
        , [listId])

    const deleteList = useCallback(() => deleteListWithEntries(listId), [listId])

    const updateListOptions = useCallback((options: Partial<ListOptions>) =>
        update(ref(database, `${PATH}/${listId}/options`), {
            ...options,
        })
        , [listId])

    return { list, updateListTitle, deleteList, updateListOptions }

}

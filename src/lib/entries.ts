import { child, onValue, onChildChanged, push, ref, remove, update } from "firebase/database"
import { useCallback, useEffect, useState } from "react"
import { Entry } from "types"
import { database } from "./firebase"

export const useEntries = (listId: string) => {
    const [entries, setEntries] = useState<Record<string, Entry> | null>(null)

    useEffect(() => {
        const entriesRef = ref(database, `entries/${listId}`);
        const unsubscriber = onValue(entriesRef, (snapshot) => {
            const data = snapshot.val();
            setEntries(data)
        });

        return unsubscriber
    }, [listId, database])

    const addEntry = useCallback((entry: Entry) =>
        push(child(ref(database), `entries/${listId}`),
            entry
        )
        , [listId, database])

    const removeEntry = useCallback((entryId: string) =>
        remove(ref(database, `entries/${listId}/${entryId}`))
        , [listId, database])

    const updateEntry = useCallback((entryId: string, entry: Partial<Entry>) =>
        update(ref(database, `entries/${listId}/${entryId}`), entry)
        , [listId, database])

    return { entries, addEntry, removeEntry, updateEntry }
}


export const useEntry = (listId: string, entryId: string) => {

    const [entry, setEntry] = useState<Entry | null>(null)

    useEffect(() => {
        const entryRef = ref(database, `entries/${listId}/${entryId}`);
        const unsubscriber = onValue(entryRef, (snapshot) => {
            const data = snapshot.val();
            setEntry(data)
        });

        return unsubscriber
    }, [listId, entryId, database])

    const pick = useCallback((giver: string | null) =>
        update(ref(database, `entries/${listId}/${entryId}`), {
            taken: {
                giver,
                timestamp: new Date().toISOString()
            }
        }), [database, listId, entryId])

    const unpick = useCallback(() =>
        remove(ref(database, `entries/${listId}/${entryId}/taken`))
        , [database, listId, entryId])


    return { entry, pick, unpick }
}
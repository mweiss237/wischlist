import { child, onValue, onChildChanged, push, ref, remove, update } from "firebase/database"
import { useCallback, useEffect, useState } from "react"
import { Entry } from "types"
import { database } from "./firebase"

export const useEntries = (listId: string) => {
    const [entries, setEntries] = useState<Record<string, Entry> | null>(null)

    useEffect(() => {

        if (entries) return

        const entriesRef = ref(database, `entries/${listId}`);
        const unsubscriber = onValue(entriesRef, (snapshot) => {
            const data = snapshot.val();
            setEntries(data)
        });

        return () => { unsubscriber() }
    }, [listId, entries, database])

    const addEntry = useCallback((entry: Entry) =>
        push(child(ref(database), `entries/${listId}`),
            entry
        )
        , [listId, database])

    const removeEntry = useCallback((entryId: string) =>
        remove(ref(database, `entries/${listId}/${entryId}`))
        , [])
    const updateEntry = useCallback((entryId: string, entry: Partial<Entry>) =>
        update(ref(database, `entries/${listId}/${entryId}`), entry)
        , [])

    return { entries, addEntry, removeEntry, updateEntry }
}
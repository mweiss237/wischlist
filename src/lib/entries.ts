import { child, onValue, push, ref, remove, runTransaction, update } from "firebase/database"
import { useCallback, useEffect, useState } from "react"
import { Entry } from "types"
import { database } from "./firebase"

export const useEntries = (listId: string) => {
    const [entries, setEntries] = useState<Record<string, Entry> | null>(null)

    useEffect(() => {
        setEntries(null)
        const path = `entries/${listId}`
        const unsubscriber = onValue(
            ref(database, path),
            (snapshot) => setEntries(snapshot.val()),
            (error) => console.error(`[rtdb] ${path}`, error)
        );

        return unsubscriber
    }, [listId])

    const addEntry = useCallback((entry: Entry) =>
        push(child(ref(database), `entries/${listId}`),
            entry
        )
        , [listId])

    const removeEntry = useCallback((entryId: string) =>
        remove(ref(database, `entries/${listId}/${entryId}`))
        , [listId])

    const updateEntry = useCallback((entryId: string, entry: Partial<Entry>) =>
        update(ref(database, `entries/${listId}/${entryId}`), entry)
        , [listId])

    // write all positions in one atomic multi-path update
    const reorderEntries = useCallback((orderedEntryIds: string[]) =>
        update(ref(database, `entries/${listId}`),
            Object.fromEntries(orderedEntryIds.map((entryId, index) => [`${entryId}/position`, index]))
        )
        , [listId])

    return { entries, addEntry, removeEntry, updateEntry, reorderEntries }
}

/**
 * Reserves an entry for a giver. Uses a transaction so two givers
 * can't take the same entry at once. Resolves to false if already taken.
 */
export const pickEntry = async (listId: string, entryId: string, giver: string | null) => {
    const result = await runTransaction(ref(database, `entries/${listId}/${entryId}/taken`), (taken) =>
        taken ? undefined : { giver, timestamp: new Date().toISOString() }
    )
    return result.committed
}

export const unpickEntry = (listId: string, entryId: string) =>
    remove(ref(database, `entries/${listId}/${entryId}/taken`))

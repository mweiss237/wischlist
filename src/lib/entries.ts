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

    const removeEntries = useCallback((entryIds: string[]) =>
        update(ref(database, `entries/${listId}`),
            Object.fromEntries(entryIds.map((entryId) => [entryId, null]))
        )
        , [listId])

    const updateEntry = useCallback((entryId: string, entry: Partial<Entry>) =>
        update(ref(database, `entries/${listId}/${entryId}`), entry)
        , [listId])

    // write all positions in one atomic multi-path update,
    // a manual reorder always switches the list back to the custom sort order
    const reorderEntries = useCallback((orderedEntryIds: string[]) =>
        update(ref(database), {
            ...Object.fromEntries(orderedEntryIds.map((entryId, index) => [`entries/${listId}/${entryId}/position`, index])),
            [`lists/${listId}/options/sortOrder`]: "custom",
        })
        , [listId])

    // switch "Dauerbrenner" on or off in one atomic update without losing commitments:
    // a taken entry becomes the first gift, gifts stay when switching back (the entry then counts as taken)
    const setEntryMulti = useCallback((entryId: string, entry: Entry, multi: boolean) => {
        const path = `entries/${listId}/${entryId}`
        if (!multi) return update(ref(database, path), { multi: null })

        const giftId = push(child(ref(database), `${path}/gifts`)).key
        return update(ref(database), {
            [`${path}/multi`]: true,
            ...(entry.taken ? { [`${path}/gifts/${giftId}`]: entry.taken, [`${path}/taken`]: null } : {}),
        })
    }, [listId])

    // after the occasion: taken entries are removed, multi entries stay and only lose their gifts
    const resetEntries = useCallback((takenEntryIds: string[], multiEntryIds: string[]) =>
        update(ref(database, `entries/${listId}`), {
            ...Object.fromEntries(takenEntryIds.map((entryId) => [entryId, null])),
            ...Object.fromEntries(multiEntryIds.map((entryId) => [`${entryId}/gifts`, null])),
        })
        , [listId])

    return { entries, addEntry, removeEntry, removeEntries, updateEntry, reorderEntries, setEntryMulti, resetEntries }
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

/**
 * Adds a giver to a multi entry ("Dauerbrenner"). Every gift gets its own push id,
 * so concurrent givers don't conflict. The key of the returned reference is available immediately.
 */
export const addGift = (listId: string, entryId: string, giver: string | null, note?: string) =>
    push(ref(database, `entries/${listId}/${entryId}/gifts`), {
        giver,
        note: note || null,
        timestamp: new Date().toISOString(),
    })

export const removeGift = (listId: string, entryId: string, giftId: string) =>
    remove(ref(database, `entries/${listId}/${entryId}/gifts/${giftId}`))

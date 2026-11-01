import { onValue, ref } from "firebase/database"
import { useEffect, useState } from "react"
import { useUser } from "./auth"
import { database } from "./firebase"

/**
 * Whether the signed in user is an admin (`admins/{uid} === true`, set in the Firebase console only).
 * `null` while loading. This only steers the UI, the write access is enforced by `database.rules.json`.
 */
export const useIsAdmin = () => {
    const { user, loading } = useUser()
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
    const uid = user?.uid

    useEffect(() => {
        setIsAdmin(null)
        if (loading) return
        if (!uid) {
            setIsAdmin(false)
            return
        }
        const path = `admins/${uid}`
        const unsubscriber = onValue(
            ref(database, path),
            (snapshot) => setIsAdmin(snapshot.val() === true),
            (error) => {
                console.error(`[rtdb] ${path}`, error)
                setIsAdmin(false)
            }
        )

        return unsubscriber
    }, [uid, loading])

    return isAdmin
}

import { useRouter } from "next/navigation"
import { useMemo, useCallback } from "react"


export const useGiver = () => {
    const router = useRouter()
    

    const giverName = useMemo(() => localStorage.getItem("giver"), [localStorage])

    const setName = useCallback((name: string) => {
        localStorage.setItem("giver", name)
        router.refresh() // localStorage is not part of react context -> need to trigger a refresh
    }, [router])

    const removeName = useCallback(() => {
        localStorage.removeItem("giver")
        router.refresh() // localStorage is not part of react context -> need to trigger a refresh
    }, [router])

    return { giverName, setName, removeName }
}
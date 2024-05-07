import { useRouter } from "next/navigation"
import {  useCallback } from "react"
import useLocalStorage from "./localStorage"


export const useGiver = () => {
    const router = useRouter()

    const [giverName, setGiverName] = useLocalStorage("giver", "")

    

    const setName = useCallback((name: string) => {
        setGiverName(name)
        router.refresh()
    }, [])

    const removeName = useCallback(() => {
        setGiverName("")
        router.refresh()
    }, [router])

    return { giverName, setName, removeName }
}
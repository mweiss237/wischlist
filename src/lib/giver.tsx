"use client"

import { useRouter } from "next/navigation"
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from "react"
import useLocalStorage from "./localStorage"


const GiverContext = createContext<{ name: string, setName: (name: string) => void }>({ name: "", setName: () => { return } })

export const GiverProvider = ({ children }: PropsWithChildren) => {
    const [giver, setName] = useState("")

    useEffect(() => {
        const name = localStorage.getItem("giver")
        console.log(name)
        setName(name || "")
    }, [setName])

    const handleSetName = useCallback((name: string) => {
        localStorage.setItem("giver", name)
        setName(name)
    }, [setName])

    return (
        <GiverContext.Provider value={{ name: giver, setName: handleSetName }}>
            {children}
        </GiverContext.Provider>
    )
}

export const useGiver = () => {
    const { name, setName } = useContext(GiverContext)


    const removeName = useCallback(() => {
        setName("")
    }, [setName])

    return { giverName: name, setName, removeName }
}
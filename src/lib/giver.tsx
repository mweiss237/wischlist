"use client"

import { createContext, PropsWithChildren, useCallback, useContext, useLayoutEffect, useState } from "react"



const GiverContext = createContext<{ name: string | null, setName: (name: string) => void }>({ name: "", setName: () => { return } })

export const GiverProvider = ({ children }: PropsWithChildren) => {
    const [giver, setName] = useState<string | null>("")

    useLayoutEffect(() => {
        const name = localStorage.getItem("giver")
        setName(name || null)
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

    return { giverName: name, setName }
}
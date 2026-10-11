"use client"

import { createContext, PropsWithChildren, useCallback, useContext, useLayoutEffect, useState } from "react"



interface GiverContextValue {
    name: string | null
    setName: (name: string) => void
    // gifts on multi entries added from this device, so they stay removable after a name change
    ownGiftIds: string[]
    rememberGift: (giftId: string) => void
    forgetGift: (giftId: string) => void
}

const GiverContext = createContext<GiverContextValue>({
    name: "",
    setName: () => { return },
    ownGiftIds: [],
    rememberGift: () => { return },
    forgetGift: () => { return },
})

const readOwnGiftIds = (): string[] => {
    try {
        const ids = JSON.parse(localStorage.getItem("giftIds") || "[]")
        return Array.isArray(ids) ? ids : []
    } catch {
        return []
    }
}

export const GiverProvider = ({ children }: PropsWithChildren) => {
    const [giver, setName] = useState<string | null>("")
    const [ownGiftIds, setOwnGiftIds] = useState<string[]>([])

    useLayoutEffect(() => {
        const name = localStorage.getItem("giver")
        setName(name || null)
        setOwnGiftIds(readOwnGiftIds())
    }, [setName])

    const handleSetName = useCallback((name: string) => {
        localStorage.setItem("giver", name)
        setName(name)
    }, [setName])

    // localStorage is the source of truth, so several entries can write without overwriting each other
    const writeOwnGiftIds = useCallback((update: (ids: string[]) => string[]) => {
        const ids = update(readOwnGiftIds())
        localStorage.setItem("giftIds", JSON.stringify(ids))
        setOwnGiftIds(ids)
    }, [])

    const rememberGift = useCallback((giftId: string) =>
        writeOwnGiftIds((ids) => ids.includes(giftId) ? ids : [...ids, giftId])
        , [writeOwnGiftIds])

    const forgetGift = useCallback((giftId: string) =>
        writeOwnGiftIds((ids) => ids.filter((id) => id !== giftId))
        , [writeOwnGiftIds])

    return (
        <GiverContext.Provider value={{ name: giver, setName: handleSetName, ownGiftIds, rememberGift, forgetGift }}>
            {children}
        </GiverContext.Provider>
    )
}

export const useGiver = () => {
    const { name, setName, ownGiftIds, rememberGift, forgetGift } = useContext(GiverContext)

    return { giverName: name, setName, ownGiftIds, rememberGift, forgetGift }
}
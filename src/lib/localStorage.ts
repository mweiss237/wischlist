import { useState } from "react"

const useLocalStorage = <T>(key: string, initialValue: T): [T, (value: T) => void] => {
    const [state, setState] = useState<T>(() => {
        // Initialize the state
        try {
            const value = (typeof window !== "undefined") ? window.localStorage.getItem(key) : null
            // Check if the local storage already has any values,
            // otherwise initialize it with the passed initialValue
            return value ? JSON.parse(value) : initialValue
        } catch (error) {
            console.log(error)
        }
    })

    const setValue = (value: T) => {
        try {
            // If the passed value is a callback function,
            //  then call it with the existing state.
            if (typeof window !== "undefined") window.localStorage.setItem(key, JSON.stringify(value))
            setState(value)
        } catch (error) {
            console.log(error)
        }
    }

    return [state, setValue]
}

export default useLocalStorage
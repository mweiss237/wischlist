import { useState } from "react"

const useLocalStorage = (key: string, initialValue: string): [string, (value: string) => void] => {
    const [state, setState] = useState<string>(() => {
        // Initialize the state
        try {
            const value = window.localStorage.getItem(key)
            // Check if the local storage already has any values,
            // otherwise initialize it with the passed initialValue
            return value ? JSON.parse(value) : initialValue
        } catch (error) {
            console.log(error)
        }
    })

    const setValue = (value: string) => {
        try {
            // If the passed value is a callback function,
            //  then call it with the existing state.
            window.localStorage.setItem(key, JSON.stringify(value))
            setState(value)
        } catch (error) {
            console.log(error)
        }
    }

    return [state, setValue]
}

export default useLocalStorage
import React from "react"
import { Priority } from "types"

interface PriorityProps {
    priority?: Priority
    className?: string
}

const labels: Record<Priority, string> = {
    [Priority.high]: "Priorität hoch",
    [Priority.medium]: "Priorität mittel",
    [Priority.low]: "Priorität niedrig",
}

// a strip of washi tape: color and width both carry the priority
const PriorityTape = ({ priority, className = "" }: PriorityProps) => {
    if (!priority || !labels[priority]) return null

    return (
        <span className={`prio_tape ${className}`} data-priority={priority} title={labels[priority]}>
            <span className="sr_only">{labels[priority]}</span>
        </span>
    )
}

export default PriorityTape

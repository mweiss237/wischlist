import React from "react"
import { Priority } from "types"
import { ChevronDown, ChevronUp, Minus } from "react-feather"

interface PriorityProps {
    priority?: Priority
}

const svgProps = { "aria-label": "Priorität", width: 20, height: 20 }

const PriorityIcon = ({ priority }: PriorityProps) => {

    switch (priority) {

        case Priority.high:
            return <ChevronUp style={{ color: "var(--prio-high)" }} {...svgProps}><title>Priorität hoch</title></ChevronUp>

        case Priority.medium:
            return <Minus style={{ color: "var(--prio-medium)" }} {...svgProps}><title>Priorität mittel</title></Minus>

        case Priority.low:
            return <ChevronDown style={{ color: "var(--prio-low)" }} {...svgProps}><title>Priorität niedrig</title></ChevronDown>

        default:
            return null

    }

}

export default PriorityIcon

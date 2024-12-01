import React from "react"
import { Priority } from "types"
import { ChevronDown, ChevronUp, Minus } from "react-feather"

interface PriorityProps {
    priority?: Priority
}

const svgProps = { alt: "Priorität", title: "Priorität", width: 20, height: 20 }

const PriorityIcon = ({ priority }: PriorityProps) => {

    switch (priority) {

        case Priority.high:
            return <ChevronUp color="#ff6361" {...svgProps} />

        case Priority.medium:
            return <Minus color="#FF9100" {...svgProps} />

        case Priority.low:
            return <ChevronDown color="#84E6E6" {...svgProps} />

        default:
            return null

    }

}

export default PriorityIcon

import React from "react"
import PrioHighSVG from "../../../public/prio-high.svg"
import PrioMediumSVG from "../../../public/prio-medium.svg"
import PrioLowSVG from "../../../public/prio-low.svg"
import { Priority } from "types"

interface PriorityProps {
    priority?: Priority
}

const svgProps = { alt: "Priorität", title: "Priorität", width: 20, height: 20 }

const PriorityIcon = ({ priority }: PriorityProps) => {

    switch (priority) {

        case Priority.high:
            return <PrioHighSVG color="#ff6361" {...svgProps} />

        case Priority.medium:
            return <PrioMediumSVG color="#FF9100" {...svgProps} />

        case Priority.low:
            return <PrioLowSVG color="#84E6E6" {...svgProps} />

        default:
            return null

    }

}

export default PriorityIcon

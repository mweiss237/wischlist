import React from "react"
import ArrowSvg from "./arrow.svg"
import BowSvg from "./bow.svg"
import CheckSvg from "./check.svg"
import CircleSvg from "./circle.svg"
import UnderlineSvg from "./underline.svg"

// hand drawn strokes, see DESIGN.md 4.10: at most two highlights per view
type DoodleProps = React.SVGProps<SVGSVGElement> & {
  // draws itself once when it appears
  draw?: boolean
}

const createDoodle = (Svg: React.ComponentType<React.SVGProps<SVGSVGElement>>, length: number) => {
  const Doodle = ({ draw = false, className = "", style, ...props }: DoodleProps) => (
    <Svg
      aria-hidden
      focusable="false"
      className={`doodle ${draw ? "doodle_draw" : ""} ${className}`}
      style={{ ["--doodle-length" as string]: length, ...style }}
      {...props}
    />
  )
  return Doodle
}

export const DoodleArrow = createDoodle(ArrowSvg, 90)
export const DoodleCheck = createDoodle(CheckSvg, 30)
export const DoodleCircle = createDoodle(CircleSvg, 290)
export const DoodleUnderline = createDoodle(UnderlineSvg, 120)

// filled, not a stroke: the bow on a wrapped list, colored via `color`
export const Bow = (props: React.SVGProps<SVGSVGElement>) => (
  <BowSvg aria-hidden focusable="false" {...props} />
)

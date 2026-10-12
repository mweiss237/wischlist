import { Atkinson_Hyperlegible, Caveat, IBM_Plex_Mono, Young_Serif } from "next/font/google"

// Next 13 does not know Atkinson Hyperlegible Next/Mono yet, see DESIGN.md section 8
export const fontDisplay = Young_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
  // Next has no fallback metrics for Young Serif
  adjustFontFallback: false,
  fallback: ["Georgia", "serif"],
})

export const fontBody = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-body",
  display: "swap",
})

export const fontLabel = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-label",
  display: "swap",
})

export const fontHand = Caveat({
  subsets: ["latin"],
  variable: "--font-hand",
  display: "swap",
})

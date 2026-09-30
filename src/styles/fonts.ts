import { Caveat, Fraunces, Inter } from "next/font/google"

export const fontDisplay = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
})

export const fontBody = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
})

export const fontHand = Caveat({
  subsets: ["latin"],
  variable: "--font-hand",
  display: "swap",
})

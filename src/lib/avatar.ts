import type { User } from "firebase/auth"

const FALLBACK_URL = "/avatar.svg"

/** "Moritz" -> "M", "Meister Propper" -> "MP", "Hans Peter Müller" -> "HM". */
export const getInitials = (name: string) => {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return ""
  const first = Array.from(words[0])[0]
  const last = words.length > 1 ? Array.from(words[words.length - 1])[0] : ""
  return `${first}${last}`.toUpperCase()
}

const escapeXml = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

// <img> resolves no CSS variables or page fonts, so the colors are the tokens from globals.scss as fixed values
const initialsSvg = (initials: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">` +
  `<style>.bg{fill:#f8f1e4}.t{fill:#1f5c45}@media (prefers-color-scheme:dark){.bg{fill:#1b2721}.t{fill:#6cbf98}}</style>` +
  `<rect class="bg" width="96" height="96"/>` +
  `<text class="t" x="48" y="50" text-anchor="middle" dominant-baseline="central" ` +
  `font-family="'Young Serif',Georgia,serif" font-size="${initials.length > 1 ? 36 : 44}" font-weight="700">` +
  `${escapeXml(initials)}</text></svg>`

/**
 * Profile picture of a user, drawn from the initials of the name (fallback: the e-mail address,
 * then a neutral silhouette). A Gravatar-style avatar only has to change here.
 */
export const getAvatarUrl = (user: User | null) => {
  const initials = getInitials(user?.displayName || user?.email || "")
  if (!initials) return FALLBACK_URL
  return `data:image/svg+xml,${encodeURIComponent(initialsSvg(initials))}`
}

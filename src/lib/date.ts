// dates are stored as local YYYY-MM-DD strings

export const todayIsoDate = () => {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  return `${now.getFullYear()}-${month}-${day}`
}

const parseIsoDate = (isoDate: string) => {
  const [year, month, day] = isoDate.split("-").map(Number)
  return new Date(year, month - 1, day)
}

export const formatEventDate = (isoDate: string) =>
  parseIsoDate(isoDate).toLocaleDateString("de-DE", { day: "numeric", month: "short", year: "numeric" })

export const daysUntil = (isoDate: string) => {
  const msPerDay = 24 * 60 * 60 * 1000
  return Math.round((parseIsoDate(isoDate).getTime() - parseIsoDate(todayIsoDate()).getTime()) / msPerDay)
}

export const describeCountdown = (isoDate: string) => {
  const days = daysUntil(isoDate)
  if (days < 0) return "vorbei"
  if (days === 0) return "heute!"
  if (days === 1) return "morgen"
  return `in ${days} Tagen`
}

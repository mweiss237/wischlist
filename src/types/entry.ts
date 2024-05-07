export interface Entry {
  text: string
  link?: string | null
  taken?: {
    timestamp: Date
    giver?: string
  }
}

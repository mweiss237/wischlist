export interface Entry {
  text: string
  link?: string
  taken?: {
    timestamp: Date
    giver?: string
  }
}

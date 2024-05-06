export interface Entry {
  text: string
  link?: string | null
  picked?: {
    timestamp: Date
    donor: string
  }
}

export interface Wish {
  id: string
  wish: string
  link?: string
  picked?: {
    timestamp: Date
    donor: string
  }
}


export interface List {
  title: string
  userId: string
  options: ListOptions
  // local date of the occasion as YYYY-MM-DD
  eventDate?: string
}

export type ListOptions = {
  blurForOwner: boolean
  isShared: boolean
}
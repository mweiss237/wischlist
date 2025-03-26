
export interface List {
  title: string
  userId: string
  options: ListOptions
}

export type ListOptions = {
  blurForOwner: boolean
  isShared: boolean
}
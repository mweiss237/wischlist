export interface Entry {
  text: string
  link?: string
  taken?: {
    timestamp: Date
    giver?: string
  }
  priority?: Priority
  position?: number 
}

export enum Priority {
  high = 1,
  medium = 2,
  low = 3
} 
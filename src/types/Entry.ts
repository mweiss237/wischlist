export interface Gift {
  // ISO string
  timestamp: string
  giver?: string
}

export interface MultiGift extends Gift {
  note?: string
}

export interface Entry {
  text: string
  link?: string
  taken?: Gift
  // "Dauerbrenner": several givers can commit to this wish via gifts
  multi?: boolean
  gifts?: Record<string, MultiGift>
  priority?: Priority
  position?: number 
}

export enum Priority {
  high = 1,
  medium = 2,
  low = 3
} 
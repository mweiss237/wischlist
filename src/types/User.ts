import { List } from "./List"

export interface User {
  id: string
  email: string
  passwordHash: string
  username: string
  lastLogin?: Date
  lists: FirebaseFirestore.DocumentReference<List>[]
  admin?: boolean
}

export interface AuthenticatedUser {
  isLoggedIn: boolean
  username?: string | null
  id?: string | null
  admin: boolean | null
}

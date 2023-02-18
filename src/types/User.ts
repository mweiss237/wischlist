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

export type RawUserData = Omit<User, "id">

export interface AuthenticatedUser {
  id: string | null
  isLoggedIn: boolean
  username?: string | null
  admin: boolean | null
}

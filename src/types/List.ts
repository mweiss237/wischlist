import { Wish } from "./Wish"

export interface List {
  id: string
  title: string
  wishes: FirebaseFirestore.DocumentReference<Wish>
}

export interface UserList {
  id: string
}

export type RawListData = Omit<List, "id">
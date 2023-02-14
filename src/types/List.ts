import { Wish } from "./Wish"

export interface List {
  id: string
  title: string
  wishes: FirebaseFirestore.DocumentReference<Wish>
}

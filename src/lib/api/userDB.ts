import { User } from "types"
// import firebase from "./firebase"

import { DatabaseHelper } from "./DatabaseHelper"

export const userDB = new DatabaseHelper<User>("users")

// const firestore = firebase.firestore()
// const collection = firestore.collection("users")

// const getDocumentById = (id: string) => {
//   return collection.doc(id)
// }

// export const getUserRef = async (userId: string) => {
//   const userRef = await getDocumentById(userId)
//   return userRef
// }

// const where = async (
//   ...condition: [
//     fieldPath: string | FirebaseFirestore.FieldPath,
//     opStr: FirebaseFirestore.WhereFilterOp,
//     value: any
//   ]
// ) => {
//   const result = await collection.where(...condition).get()
//   return result.docs
// }

// export const getAllUsers = async () => {
//   const collectionRef = await collection.get()
//   return collectionRef.docs
// }

// export const addUser = async (data: Omit<User, "id">) => {
//   const userRef = await collection.add(data)
//   const added = await userRef.get()
//   return added
// }

// export const updateUser = async (id: string, data: Partial<User>) => {
//   const userRef = getDocumentById(id)
//   return await userRef.set(data, { merge: true })
// }

// const removeUser = async (id: string) => {
//   const userRef = getDocumentById(id)
//   return await userRef.delete()
// }

import {
  addDoc,
  collection,
  DocumentReference,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { firestore as db } from "./firebase";

const wishCollection = collection(db, "wishes");

export interface Wish extends DocumentReference {
  wish: string;
}

export const saveWish = async (wish: any) =>
  await addDoc(wishCollection, { wish });

export const getWishes = async () => await (await getDocs(wishCollection)).docs;

export const udpateWish = async (document: Wish, wish: string) =>
  await updateDoc(document, { wish });

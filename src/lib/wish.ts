import { DatabaseHelper } from "./databaseHelper";

export interface Wish {
  wish: string;
}

// export const addWish = async (wish: any) =>
//   await addDoc(wishCollection, { wish });

// export const getWishes = async () => await (await getDocs(wishCollection)).docs;

// /**
//  *
//  * @param document reference to get from wishes
//  * @returns
//  */
// export const getWish = async (document: Wish) => await getDoc(document);

// export const udpateWish = async (document: Wish, wish: string) =>
//   await updateDoc(document, { wish });

export const wishDB = new DatabaseHelper<Wish>("wishes");

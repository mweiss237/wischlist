import {
  addDoc,
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  UpdateData,
  updateDoc,
  WithFieldValue,
} from "firebase/firestore";
import { firestore } from "./db";

export class DatabaseHelper<T extends DocumentData> {
  private collection: CollectionReference<T>;

  constructor(collectionName: string) {
    // @ts-ignore
    this.collection = collection(firestore, collectionName);
  }

  private getReference = (id: string) => doc(this.collection, id);

  public get = async (id: string) => {
    const ref = this.getReference(id);
    const document = await getDoc<T>(ref);
    return document.exists()
      ? {
          ...document.data(),
          id: document.id,
        }
      : null;
  };

  public getAll = async () => {
    const docs = await (await getDocs<T>(this.collection)).docs;
    return docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });
  };

  public add = async (data: WithFieldValue<T>) => {
    const ref = await addDoc<T>(this.collection, data);
    const addedDoc = await getDoc<T>(ref);
    return {
      wish: "", // set wish as default empty array. Will be overwritten if present in data()
      ...addedDoc.data(),
      id: addedDoc.id,
    };
  };

  public update = async (id: string, data: UpdateData<T>) => {
    const ref = this.getReference(id);
    await updateDoc(ref, data);
  };

  public delete = async (id: string) => {
    const ref = this.getReference(id);
    await deleteDoc(ref);
  };
}

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
} from "firebase/firestore";
import { firestore } from "./firebase";
import { Wish } from "./wish";

export class DatabaseHelper<T extends DocumentData> {
  private db: CollectionReference<T>;

  constructor(collectionName: string) {
    // @ts-ignore
    this.db = collection(firestore, collectionName);
  }

  private getReference = (id: string) => doc(this.db, id);

  public get = async (id: string) => {
    const ref = this.getReference(id);
    const document = await getDoc<T>(ref);
    return {
      ...document.data(),
      id: document.id,
    };
  };

  public getAll = async () => {
    // @ts-ignore
    const docs = await (await getDocs<Wish>(this.db)).docs;
    return docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });
  };

  public add = async (data: T) => await addDoc(this.db, data);

  public update = async (id: string, data: UpdateData<T>) => {
    const ref = this.getReference(id);
    await updateDoc(ref, data);
  };

  public delete = async (id: string) => {
    const ref = this.getReference(id);
    await deleteDoc(ref);
  };
}

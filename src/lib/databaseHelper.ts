import {
  addDoc,
  collection,
  CollectionReference,
  deleteDoc,
  DocumentData,
  DocumentReference,
  getDoc,
  getDocs,
  UpdateData,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "./firebase";

export class DatabaseHelper<T extends DocumentData> {
  private db: CollectionReference<DocumentData>;

  constructor(collectionName: string) {
    this.db = collection(firestore, collectionName);
  }

  public get = async (document: DocumentReference<T>) => await getDoc(document);

  public getAll = async () => await getDocs(this.db);

  public add = async (data: T) => await addDoc(this.db, data);

  public update = async (document: DocumentReference<T>, data: UpdateData<T>) =>
    await updateDoc(document, data);

  public delete = async (document: DocumentReference<T>) =>
    await deleteDoc(document);
}

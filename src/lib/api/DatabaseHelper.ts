import firebase from "./firebase"

export class DatabaseHelper<T> {
  private collection
  private firestore

  constructor(collectionName: string) {
    this.firestore = firebase.firestore()
    this.collection = this.firestore.collection(collectionName)
  }

  private getReferenceById = (id: string) => {
    return this.collection.doc(id)
  }

  public get = async (id: string) => {
    const ref = await this.getReferenceById(id)
    return ref as FirebaseFirestore.DocumentReference<T>
  }

  public where = async (
    ...condition: [
      fieldPath: string | FirebaseFirestore.FieldPath,
      opStr: FirebaseFirestore.WhereFilterOp,
      value: any
    ]
  ) => {
    const result = await this.collection.where(...condition).get()
    return result.docs
  }

  public getAll = async () => {
    const result = await this.collection.get()
    return result.docs
  }

  public add = async (data: Omit<T, "id">) => {
    const ref = await this.collection.add(data)
    return ref
  }

  public update = async (id: string, data: Partial<T>) => {
    const ref = this.getReferenceById(id)
    return await ref.set(data, { merge: true })
  }

  public delete = async (id: string) => {
    const ref = this.getReferenceById(id)
    return await ref.delete()
  }
}

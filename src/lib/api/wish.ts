import { DatabaseHelper } from "./DatabaseHelper";


export interface Wish {
  id: string
  wish: string;
  // link?
  // userid
}


export const wishDB = new DatabaseHelper<Wish>("wishes");

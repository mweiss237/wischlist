import { DatabaseHelper } from "./databaseHelper";

export interface Wish {
  wish: string;
  // link?
  // userid
}

export const wishDB = new DatabaseHelper<Wish>("wishes");

import { Wish } from "types/Wish";
import { DatabaseHelper } from "./DatabaseHelper";

export const wishDB = new DatabaseHelper<Wish>("wishes");

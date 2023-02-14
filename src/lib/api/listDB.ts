import { List } from "types/List"
import { DatabaseHelper } from "./DatabaseHelper"

export const listDB = new DatabaseHelper<List>("lists")

import { List } from "types"
import { DatabaseHelper } from "./DatabaseHelper"

export const listDB = new DatabaseHelper<List>("lists")

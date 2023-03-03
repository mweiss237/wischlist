import { User } from "types"
import { DatabaseHelper } from "./DatabaseHelper"

export const userDB = new DatabaseHelper<User>("users")

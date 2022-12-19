import { User } from "types/User"
import { DatabaseHelper } from "./DatabaseHelper"

export const userDB = new DatabaseHelper<User>("users")

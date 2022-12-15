import { DatabaseHelper } from "./DatabaseHelper";

export interface User {
  email: string
  passwordHash: string
  username: string
  lastLogin: Date
}

export const userDB = new DatabaseHelper<User>("users");

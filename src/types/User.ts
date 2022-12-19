export interface User {
  id: string;
  email: string;
  passwordHash: string;
  username: string;
  lastLogin: Date;
}

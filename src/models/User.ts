export interface User {
  id: number;
  username: string;
  email: string;
  passwordHash: string;
}
export const users: User[] = [];

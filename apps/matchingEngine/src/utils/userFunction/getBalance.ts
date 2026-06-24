import { users } from "../../store/users";

export function getBalance(userId: string) {
  const userExist = users.find((u) => u.userId === userId);
  if (!userExist) {
    return -1;
  }
  return userExist.balance;
}

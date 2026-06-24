import type { userType } from "@repo/orderbook";
import { users } from "../../store/users";

export function addUser(userInput: userType) {
  const userExist = users.find((u) => u.userId == userInput.userId);
  if (userExist) {
    console.log("user already exist!");
    return -1;
  }
  users.push(userInput);
  return 1;
}

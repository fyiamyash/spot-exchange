import type { userEvent, userType } from "@repo/orderbook";
import { addUser } from "./utils/userFunction/addUsers";
import { addBalancetoUser } from "./utils/userFunction/addBalance";
import { users } from "./store/users";
import { getBalance } from "./utils/userFunction/getBalance";

export function userOperations(ev: userEvent, incomingUser: userType) {
  if (ev === "add_user") {
    //user

    console.log("route to add user function");

    let result = addUser(incomingUser);

    if (result == -1) {
      return { status: false, reason: "User Already exists!" };
    } else {
      return { status: true, reason: "User created!" };
    }
  } else if (ev === "add_balance") {
    console.log("--------------add balance called");

    let result = addBalancetoUser(incomingUser);
    if (result == -1) {
      return { status: false, reason: "User doesn't exist!" };
    } else {
      return { status: true, reason: "Balance added!" };
    }
  } else if (ev === "get_userBalance") {
    console.log("--------------Get balance called");
    let result = getBalance(incomingUser.userId);
    if (result === -1) {
      return { status: false, reason: "User doesn't exist!" };
    } else {
      return { status: true, reason: "Balance :", balance: result };
    }
  } else {
    return { status: false, reason: "invalid option in userOperations!" };
  }
}

import type {
  addMoneyToWallet,
  orderSideType,
  userType,
} from "@repo/orderbook";
import { users } from "../../store/users";

export function addBalancetoUser(userIncoming: userType) {
  try {
    const userExist = users.find((u) => u.userId === userIncoming.userId);
    if (!userExist) {
      return -1;
    }
    userExist.balance = userIncoming.balance;
    return 1;
  } catch (e) {
    console.log("error in addBalancetoUser function", e);
  }
}

export function updateUserBalance(
  userId: string,
  amount: number,
  sideForDeduction: orderSideType,
  market: string,
  quantity: number,
) {
  const userExist = users.find((u) => u.userId === userId);
  console.log();
  if (!userExist) {
    throw new Error(`The user Id ${userId} doesnot exist `);
  }
  if (userExist && sideForDeduction === "ASK") {
    userExist.balance["USD"]!.available += amount * quantity;
    userExist.balance[market]!.locked -= quantity;
  } else if (userExist && sideForDeduction === "BID") {
    userExist.balance["USD"]!.locked -= quantity * amount;
    userExist.balance[market]!.available += quantity;
  }
}

import type { incomingOrderType } from "@repo/orderbook";
import { users } from "../../store/users";

export function isAffordable(incomingOrder: incomingOrderType) {
  const { price, quantity, userId } = incomingOrder;

  const userExist = users.find((u) => u.userId === userId);
  if (!userExist) {
    return { status: false, reason: "User doesn't exist!" };
  }
  if (userExist && incomingOrder.side === "BID") {
    let totalAmount = price * quantity;
    if (userExist.balance["USD"]!.available > totalAmount) {
      userExist.balance["USD"]!.available -= totalAmount;
      userExist.balance["USD"]!.locked += totalAmount;
      return { status: true, reason: "Amount locked" };
    } else {
      return { status: false, reason: "User can't affoard" };
    }
  }

  if (userExist && incomingOrder.side === "ASK") {
    let totalAmount = quantity;
    if (userExist.balance[incomingOrder.market]) {
      if (userExist.balance[incomingOrder.market]!.available > totalAmount) {
        userExist.balance[incomingOrder.market]!.available -= totalAmount;
        userExist.balance[incomingOrder.market]!.locked += totalAmount;
        return { status: true, reason: "Asset quantity locked" };
      } else {
        return { status: false, reason: "User can't affoard" };
      }
    } else {
      return {
        status: false,
        reason: `User does't have asset :${incomingOrder.market}`,
      };
    }
  }
}

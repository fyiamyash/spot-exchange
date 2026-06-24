import type {
  incomingOrderType,
  matchineEngineEvent,
  userType,
} from "@repo/orderbook";
import { limitOrder } from "./utils/orderFunction/limitOrders";
import { addMarket } from "./utils/orderFunction/addingMarket";
import { marketOrder } from "./utils/orderFunction/marketOrders";
import { cancelOrder } from "./utils/orderFunction/cancelOrder";
import { isAffordable } from "./utils/userFunction/isAffordable";
import { users } from "./store/users";

export function matchingEngine(
  ev: matchineEngineEvent,
  incomingOrder: incomingOrderType,
) {
  if (ev === "add_market") {
    // add market

    console.log("route to add market function");
    const { market } = incomingOrder;
    const result = addMarket(market);

    return result;
  } else if (ev === "create_order") {
    // check user balance :
    let affoard = isAffordable(incomingOrder);
    console.log("route to create  order function");
    if (!affoard!.status) {
      return affoard;
    }
    if (affoard!.status) {
      if (incomingOrder.type === "LIMIT") {
        return limitOrder(incomingOrder);
      }
      if (incomingOrder.type === "MARKET") {
        return marketOrder(incomingOrder);
      }
    }
  } else if ((ev = "cancel_order")) {
    let result = cancelOrder(incomingOrder);

    if (result == -1) {
      return { status: false, reason: "Order doesn't exist!" };
    } else {
      return {
        status: true,
        reason: `order ${incomingOrder.orderId} deleted`,
        cancelOrder: incomingOrder.orderId,
      };
    }
  }
}

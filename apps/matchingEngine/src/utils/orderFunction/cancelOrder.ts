import type { incomingOrderType } from "@repo/orderbook";
import { OrderBooks } from "../../store/orderbook";

export function cancelOrder(incomingOrder: incomingOrderType) {
  const { orderId, market, side, price } = incomingOrder;
  // let orderSide = side === "BID" ? "BUY" : "ASK";
  let orderExistFlag = false;
  let reduceQunatity = 0;
  let priceNumber = Number(price);
  if (side == "ASK") {
    let priceLevel = OrderBooks[market]!.asks.get(priceNumber);
    if (!priceLevel) {
      console.log("price level doesn't exist");
      return -1;
    }
    priceLevel!.openOrders = priceLevel!.openOrders.filter((o) => {
      if (o.orderId === orderId) {
        reduceQunatity = o.availableQuantity;
        orderExistFlag = true;
        return false;
      }
      return true;
    });

    priceLevel!.totalAvailable -= reduceQunatity;
    OrderBooks[market]!.asks.set(priceNumber, priceLevel!);
  } else if (side == "BID") {
    let priceLevel = OrderBooks[market]!.bids.get(price);

    if (!priceLevel) {
      console.log("price level doesn't exist");
      return -1;
    }

    priceLevel!.openOrders = priceLevel!.openOrders.filter((o) => {
      if (o.orderId === orderId) {
        reduceQunatity = o.availableQuantity;
        orderExistFlag = true;
        return false;
      }
      return true;
    });
    priceLevel!.totalAvailable -= reduceQunatity;
    OrderBooks[market]!.asks.set(priceNumber, priceLevel!);
  } else {
    console.log("error in option of cancel order");
  }
  if (!orderExistFlag) {
    return -1;
  }

  return 1;
}

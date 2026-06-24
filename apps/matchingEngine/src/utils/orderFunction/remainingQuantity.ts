import type { incomingOrderType } from "@repo/orderbook";
import { OrderBooks } from "../../store/orderbook";

export function addRemainingQuantityToOrderBook(
  or: incomingOrderType,
  quantity: number,
) {
  const { userId, price, side, orderId, market } = or;
  if (side === "ASK") {
    // since incoming order is for selling we will add in the askbook
    let asks = OrderBooks[market]!.asks.get(price);
    if (asks) {
      asks.totalAvailable += quantity;
      asks.openOrders.push({
        userId: userId,
        orderId: orderId,
        availableQuantity: quantity,
        filledQuantity: 0,
        createdAt: new Date().toISOString(),
      });
    } else {
      OrderBooks[market]!.asks.set(price, {
        totalAvailable: quantity,
        openOrders: [
          {
            userId: userId,
            orderId: orderId,
            availableQuantity: quantity,
            filledQuantity: 0,
            createdAt: new Date().toISOString(),
          },
        ],
      });
    }

    return quantity;
  }
  if (side === "BID") {
    // since incoming order is for selling we will add in the askbook
    let bids = OrderBooks[market]!.bids.get(price);
    if (bids) {
      bids.totalAvailable += quantity;
      bids.openOrders.push({
        userId: userId,
        orderId: orderId,
        availableQuantity: quantity,
        filledQuantity: 0,
        createdAt: new Date().toISOString(),
      });
    } else {
      OrderBooks[market]!.bids.set(price, {
        totalAvailable: quantity,
        openOrders: [
          {
            userId: userId,
            orderId: orderId,
            availableQuantity: quantity,
            filledQuantity: 0,
            createdAt: new Date().toISOString(),
          },
        ],
      });
    }

    return quantity;
  }
}

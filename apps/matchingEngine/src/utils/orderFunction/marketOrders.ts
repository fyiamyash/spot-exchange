import type { fillsType, incomingOrderType } from "@repo/orderbook";
import { OrderBooks } from "../../store/orderbook";
import { addRemainingQuantityToOrderBook } from "./remainingQuantity";

export function marketOrder(incomingOrder: incomingOrderType) {
  const { userId, quantity, side, orderId, market } = incomingOrder;
  console.log("market");
  let fills: fillsType[] = [];
  let reason: string;
  let remainingQuantity = quantity;
  if (side == "ASK") {
    while (remainingQuantity > 0) {
      let bestBid = OrderBooks[market]!.bids.maxKey();
      if (bestBid) {
        let currentPriceLevel = OrderBooks[market]!.bids.get(bestBid!);
        for (let i = 0; i < currentPriceLevel!.openOrders.length; i++) {
          if (remainingQuantity == 0) {
            break;
          }
          let makerOrder = currentPriceLevel!.openOrders[i];
          let fillQty = Math.min(
            makerOrder!.availableQuantity,
            remainingQuantity,
          );
          fills.push({
            price: bestBid,
            quantity: fillQty,

            makerOrderId: makerOrder!.orderId,
            makerSide: "BID",
            makerId: makerOrder!.userId,

            takerOrderId: orderId,
            takerSide: "ASK",
            takerId: userId,

            market: market,

            createdAt: new Date().toISOString(),
          });
          OrderBooks[market]!.lastTradedPrices = bestBid;
          console.log("last tradedPrice", OrderBooks[market]!.lastTradedPrices);
          makerOrder!.availableQuantity -= fillQty;
          makerOrder!.filledQuantity += fillQty;
          remainingQuantity -= fillQty;
          currentPriceLevel!.totalAvailable -= fillQty;
          currentPriceLevel!.openOrders = currentPriceLevel!.openOrders.filter(
            (o) => {
              if (o.availableQuantity > 0) {
                return true;
              }
            },
          );
          if (currentPriceLevel!.totalAvailable == 0) {
            OrderBooks[market]!.bids.delete(bestBid);
          }
          if (currentPriceLevel!.totalAvailable > 0) {
            OrderBooks[market]!.bids.set(bestBid, currentPriceLevel!);
          }
        }
      } else {
        break;
      }
    }
  }
  if (side == "BID") {
    while (remainingQuantity > 0) {
      let bestAsk = OrderBooks[market]!.asks.minKey();
      console.log(bestAsk);
      if (bestAsk) {
        let currentPriceLevel = OrderBooks[market]!.asks.get(bestAsk!);

        // break;
        for (let i = 0; i < currentPriceLevel!.openOrders.length; i++) {
          if (remainingQuantity == 0) {
            break;
          }
          let makerOrder = currentPriceLevel!.openOrders[i];
          let fillQty = Math.min(
            makerOrder!.availableQuantity,
            remainingQuantity,
          );
          fills.push({
            price: bestAsk,
            quantity: fillQty,

            makerOrderId: makerOrder!.orderId,
            makerSide: "ASK",
            makerId: makerOrder!.userId,

            takerOrderId: orderId,
            takerSide: "BID",
            takerId: userId,

            market: market,

            createdAt: new Date().toISOString(),
          });
          console.log(remainingQuantity);
          OrderBooks[market]!.lastTradedPrices = bestAsk;
          makerOrder!.availableQuantity -= fillQty;
          makerOrder!.filledQuantity += fillQty;
          remainingQuantity -= fillQty;
          currentPriceLevel!.totalAvailable -= fillQty;
          currentPriceLevel!.openOrders = currentPriceLevel!.openOrders.filter(
            (o) => {
              if (o.availableQuantity > 0) {
                return true;
              }
            },
          );
          if (currentPriceLevel!.totalAvailable == 0) {
            OrderBooks[market]!.asks.delete(bestAsk);
          }
          if (currentPriceLevel!.totalAvailable > 0) {
            OrderBooks[market]!.asks.set(bestAsk, currentPriceLevel!);
          }
        }
      } else {
        break;
      }
    }
  }

  if (remainingQuantity > 0) {
    // addRemainingQuantityToOrderBook(incomingOrder, remainingQuantity);
    reason = `Asset not available to fulfill: ${remainingQuantity} order`;
  } else {
    reason = "Results";
  }

  return { status: true, reason, fills };
}

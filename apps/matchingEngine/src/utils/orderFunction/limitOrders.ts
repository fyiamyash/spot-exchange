import type { fillsType, incomingOrderType } from "@repo/orderbook";

import { addRemainingQuantityToOrderBook } from "./remainingQuantity";
import { OrderBooks } from "../../store/orderbook";
import { updateUserBalance } from "../userFunction/addBalance";

export function limitOrder(inOrder: incomingOrderType) {
  const { userId, price, quantity, side, market, orderId } = inOrder;
  if (!OrderBooks) return;
  let fills: fillsType[] = [];
  let createdOrder;
  let remainQtyforOrder = quantity;
  if (side === "ASK") {
    const betterBid = OrderBooks[market]!.bids.maxKey();

    // if when the askbook is empty it will directly add that in the orderbook
    // if price asked is grater than maxbid than it should add it to the askbook

    if (betterBid! >= price) {
      while (remainQtyforOrder > 0) {
        let currentBestBid = OrderBooks[market]!.bids.maxKey();
        if (!currentBestBid || currentBestBid < price) {
          break;
        }
        let currentPriceLevel = OrderBooks[market]!.bids.get(currentBestBid!);
        for (let i = 0; i < currentPriceLevel!.openOrders.length; i++) {
          let makerOrder = currentPriceLevel!.openOrders[i];
          if (remainQtyforOrder == 0) {
            break;
          }
          let fillQty = Math.min(
            remainQtyforOrder,
            makerOrder!.availableQuantity,
          );
          fills.push({
            price: currentBestBid,
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
          OrderBooks[market]!.lastTradedPrices = currentBestBid;
          makerOrder!.availableQuantity -= fillQty;
          makerOrder!.filledQuantity += fillQty;
          currentPriceLevel!.totalAvailable -= fillQty;
          remainQtyforOrder -= fillQty;
          currentPriceLevel!.openOrders = currentPriceLevel!.openOrders.filter(
            (or) => {
              if (or.availableQuantity == 0) {
                return false;
              }
              return true;
            },
          );
          if (currentPriceLevel!.totalAvailable == 0) {
            OrderBooks[market]!.bids.delete(currentBestBid!);
          }
          if (currentPriceLevel!.totalAvailable > 0) {
            OrderBooks[market]!.bids.set(currentBestBid, currentPriceLevel!);
          }
        }
      }
    }
    if (!betterBid || betterBid < price) {
      createdOrder = addRemainingQuantityToOrderBook(
        inOrder,
        remainQtyforOrder,
      );
    }
  }
  if (side === "BID") {
    let betterAsk = OrderBooks[market]!.asks.minKey();

    // if when the askbook is empty it will directly add that in the orderbook
    // if price asked is grater than maxbid than it should add it to the askbook

    if (betterAsk! <= price) {
      //  when price lower then the ask is present :
      while (remainQtyforOrder > 0) {
        let currentBestAsk = OrderBooks[market]!.asks.minKey();
        if (!currentBestAsk || currentBestAsk > price) {
          break;
        }
        const currentPriceLevel = OrderBooks[market]!.asks.get(currentBestAsk);
        for (let i = 0; i < currentPriceLevel!.openOrders.length; i++) {
          if (remainQtyforOrder == 0) {
            break;
          }
          let makerOrder = currentPriceLevel!.openOrders[i];
          let fillQty = Math.min(
            makerOrder!.availableQuantity,
            remainQtyforOrder,
          );
          fills.push({
            price: currentBestAsk,
            quantity: fillQty,

            makerOrderId: makerOrder!.orderId,
            makerSide: "ASK",
            makerId: makerOrder!.userId,

            takerOrderId: inOrder.orderId,
            takerSide: "BID",
            takerId: inOrder.userId,

            market: market,

            createdAt: new Date().toISOString(),
          });
          OrderBooks[market]!.lastTradedPrices = currentBestAsk;

          makerOrder!.availableQuantity -= fillQty;
          makerOrder!.filledQuantity += fillQty;
          currentPriceLevel!.totalAvailable -= fillQty;
          remainQtyforOrder -= fillQty;
          currentPriceLevel!.openOrders = currentPriceLevel!.openOrders.filter(
            (or) => {
              if (or.availableQuantity == 0) {
                return false;
              }
              return true;
            },
          );
          if (currentPriceLevel!.totalAvailable == 0) {
            OrderBooks[market]!.asks.delete(currentBestAsk);
          }
          if (currentPriceLevel!.totalAvailable > 0) {
            OrderBooks[market]!.asks.set(currentBestAsk, currentPriceLevel!);
          }
        }
      }
    }
    if (!betterAsk || betterAsk! > price || remainQtyforOrder > 0) {
      console.log("add to orderbook- price is lower than better ASk");
      createdOrder = addRemainingQuantityToOrderBook(
        inOrder,
        remainQtyforOrder,
      );
    }
  }
  if (!createdOrder) {
    createdOrder = 0;
  }
  if (fills.length > 0) {
    fills.forEach((f) => {
      updateUserBalance(f.makerId, f.price, f.makerSide, f.market, f.quantity);
      updateUserBalance(f.takerId, f.price, f.takerSide, f.market, f.quantity);
    });
  }

  return { status: true, fills, createdOrder };
}

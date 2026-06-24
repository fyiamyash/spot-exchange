import BTree from "sorted-btree";
import type { priceLevelType } from "@repo/orderbook";
import { OrderBooks } from "../../store/orderbook";

export function addMarket(market: string) {
  OrderBooks[market] = {
    asks: new BTree<number, priceLevelType>(),
    bids: new BTree<number, priceLevelType>(undefined, (a, b) => b - a),
    lastTradedPrices: 0,
  };
  console.log(OrderBooks);
  if (!OrderBooks[market]) {
    return -1;
  }

  return 1;
}

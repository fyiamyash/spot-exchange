import type { freshBookType, priceLevelType } from "@repo/orderbook";
import BTree from "sorted-btree";

// export const orderBook = new Map<string, bookType>();
export const OrderBooks: Record<
  string,
  {
    asks: BTree<number, priceLevelType>;
    bids: BTree<number, priceLevelType>;
    lastTradedPrices: number;
  }
> = {
  SOL: {
    asks: new BTree<number, priceLevelType>(),
    bids: new BTree<number, priceLevelType>(undefined, (a, b) => b - a),
    lastTradedPrices: 0,
  },
  BTC: {
    asks: new BTree<number, priceLevelType>(),
    bids: new BTree<number, priceLevelType>(undefined, (a, b) => b - a),
    lastTradedPrices: 0,
  },
};

export const freshbookForFrontEnd: freshBookType = {};

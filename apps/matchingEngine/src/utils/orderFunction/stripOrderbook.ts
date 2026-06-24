import type { freshBookType } from "@repo/orderbook";
import { freshbookForFrontEnd, OrderBooks } from "../../store/orderbook";

export function stripOrderBook(market: string) {
  freshbookForFrontEnd[market] = {
    ask: [],
    bid: [],
    lastTradedPrice: 0,
  };

  freshbookForFrontEnd[market].lastTradedPrice =
    OrderBooks[market]!.lastTradedPrices;
  let pricesOfAsk = [...OrderBooks[market]!.asks.keys()];
  let pricesOfBid = [...OrderBooks[market]!.bids.keys()];
  pricesOfAsk = pricesOfAsk.slice(0, 10);
  pricesOfBid = pricesOfBid.slice(0, 10);
  if (pricesOfAsk.length !== 0) {
    for (let i = 0; i < pricesOfAsk.length; i++) {
      const priceOfMarket = pricesOfAsk[i];
      const availableQty = OrderBooks[market]!.asks.get(
        priceOfMarket!,
      )!.totalAvailable;
      if (!priceOfMarket || !availableQty) {
        console.log("price or qty is not present for the freshbook");
        return;
      }
      freshbookForFrontEnd[market].ask.push([priceOfMarket, availableQty]);
    }
  }
  if (pricesOfBid.length !== 0) {
    for (let i = 0; i < pricesOfBid.length; i++) {
      const priceOfMarket = pricesOfBid[i];
      const availableQty = OrderBooks[market]!.bids.get(
        priceOfMarket!,
      )!.totalAvailable;
      if (!priceOfMarket || !availableQty) {
        console.log("price or qty is not present for the freshbook");
        return;
      }
      freshbookForFrontEnd[market].bid.push([priceOfMarket, availableQty]);
    }
  }
}

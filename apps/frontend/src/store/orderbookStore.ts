import { create } from "zustand";

export interface incomingOrderBookType {
  ask: number[][];
  bid: number[][];
  lastTradedPrice: number;
}

export const orderBookStore = create<incomingOrderBookType>((set) => ({
  ask: [],
  bid: [],
  lastTradedPrice: 0,

  updateOrderbook: (data: incomingOrderBookType) => {
    set({
      ask: data.ask,
      bid: data.bid,
      lastTradedPrice: data.lastTradedPrice,
    });
  },
}));

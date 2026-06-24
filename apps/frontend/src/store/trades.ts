import type { fillsType } from "@repo/orderbook";
import { create } from "zustand";
type incomingOrderTypeFrontEnd = {
  userId: string;
  id: string;
  price: number;
  quantity: number;
  status: string;
  market: string;
  filledQuantity: string;
  createdAt: string;
  side: string;
};
interface incomingFills {
  initialFills: fillsType[];
  setInitialFills: (data: fillsType[]) => void;
}

interface incomingOrderHistory {
  initialOrders: incomingOrderTypeFrontEnd[];
  setOrderHistory: (data: incomingOrderTypeFrontEnd[]) => void;
}
interface incomingOpenOrders {
  initialOpenOrders: incomingOrderTypeFrontEnd[];
  setOpenOrders: (data: incomingOrderTypeFrontEnd[]) => void;
}

export const fillsStore = create<incomingFills>((set) => ({
  initialFills: [],
  setInitialFills: (data) =>
    set({
      initialFills: data,
    }),
}));

export const orderHistoryStore = create<incomingOrderHistory>((set) => ({
  initialOrders: [],
  setOrderHistory: (data) =>
    set({
      initialOrders: data,
    }),
}));

export const openOrdersStore = create<incomingOpenOrders>((set) => ({
  initialOpenOrders: [],
  setOpenOrders: (data) =>
    set({
      initialOpenOrders: data,
    }),
}));

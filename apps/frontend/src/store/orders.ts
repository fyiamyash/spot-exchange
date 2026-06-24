import { create } from "zustand";

interface priceType {
  price: string;
  setPrice: (data: string) => void;
}
interface quantityType {
  quantity: string;
  setQuantity: (data: string) => void;
}
interface assetType {
  symbol: string;
  setSymbol: (data: string) => void;
}

interface orderSideTypeForFrontEnd {
  side: string;
  setSide: (data: string) => void;
}

interface orderTypeForFrontEnd {
  otype: string;
  setOtype: (data: string) => void;
}

interface assetBalanceType {
  available: number;
  locked: number;
}

interface BalanceType {
  [assetName: string]: assetBalanceType;
}

interface balanceStoreType {
  balance: BalanceType;
  setBalance: (balance: BalanceType) => void;
}

export const priceStore = create<priceType>((set) => ({
  price: "",
  setPrice: (data) => {
    set({
      price: data,
    });
  },
}));

export const quantityStore = create<quantityType>((set) => ({
  quantity: "",
  setQuantity: (data) => {
    set({
      quantity: data,
    });
  },
}));

export const assetStore = create<assetType>((set) => ({
  symbol: "SOL",
  setSymbol: (data) => {
    set({
      symbol: data,
    });
  },
}));

export const orderSideStore = create<orderSideTypeForFrontEnd>((set) => ({
  side: "BUY",
  setSide: (data) => {
    set({
      side: data,
    });
  },
}));

export const orderTypeStore = create<orderTypeForFrontEnd>((set) => ({
  otype: "LIMIT",
  setOtype: (data) => {
    set({
      otype: data,
    });
  },
}));

export const useBalanceStore = create<balanceStoreType>((set) => ({
  balance: {},
  setBalance: (balance) => set({ balance }),
}));

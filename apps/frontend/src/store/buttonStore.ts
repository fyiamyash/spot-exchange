import { create } from "zustand";

interface bySellButtonType {
  buySell: "BUY" | "SELL";
  updateBuySellButton: (data: "BUY" | "SELL") => void;
}

interface modalInterface {
  showModal: boolean;
  setShowModal: () => void;
}

interface toggleStore {
  isOpen: boolean;
  setIsOpen: () => void;
}

interface transitionStoreType {
  isOpen: boolean;
  setTransition: (data: boolean) => void;
}

export const buySellButtonStore = create<bySellButtonType>((set) => ({
  buySell: "BUY",
  updateBuySellButton: (data) => {
    set({
      buySell: data,
    });
  },
}));

export const modalPopUp = create<modalInterface>((set) => ({
  showModal: false,
  setShowModal: () =>
    set((state: modalInterface) => ({ showModal: !state.showModal })),
}));

export const signInToggle = create<toggleStore>((set) => ({
  isOpen: false,
  setIsOpen: () => set((state: toggleStore) => ({ isOpen: !state.isOpen })),
}));

export const logInToggle = create<toggleStore>((set) => ({
  isOpen: false,

  setIsOpen: () =>
    set((state: toggleStore) => ({
      isOpen: !state.isOpen,
    })),
}));

export const transitionStore = create<transitionStoreType>((set) => ({
  isOpen: false,
  setTransition: (data) => {
    set({
      isOpen: data,
    });
  },
}));

import { useOrder } from "../hooks/order";
import { buySellButtonStore } from "../store/buttonStore";
import {
  assetStore,
  orderTypeStore,
  priceStore,
  quantityStore,
} from "../store/orders";

export const BuyButton = () => {
  const updateButton = buySellButtonStore((state) => state.updateBuySellButton);
  const valueOfButton = buySellButtonStore((state) => state.buySell);

  return (
    <div className="w-full h-full flex p-1 ">
      <button
        onClick={() => updateButton("BUY")}
        className={`w-1/2 h-full rounded-md text-sm font-medium transition-colors ${
          valueOfButton === "BUY" ? "bg-green-100 " : "hover:text-slate-600"
        }`}
      >
        Buy
      </button>
      <button
        onClick={() => updateButton("SELL")}
        className={`w-1/2 h-full rounded-md text-sm font-medium transition-colors ${
          valueOfButton === "SELL" ? "bg-red-200 " : "hover:text-slate-600"
        }`}
      >
        Sell
      </button>
    </div>
  );
};

export const ButtonForBuySellSection = () => {
  const { placeOrder } = useOrder();
  const orderSide = buySellButtonStore((state) => state.buySell);
  const orderType = orderTypeStore((s) => s.otype);
  const price = priceStore((s) => s.price);
  const quantity = quantityStore((s) => s.quantity);
  const market = assetStore((s) => s.symbol);

  function orderHandler(
    market: string,
    price: string,
    quantity: string,
    side: string,
    type: string,
  ) {
    const Changedprice = Number(price);
    const changedQuantity = Number(quantity);
    if (side === "SELL") {
      side = "ASK";
    } else {
      side = "BID";
    }
    placeOrder(market, Changedprice, changedQuantity, side, type);
  }
  return (
    <button
      className="w-full h-13 bg-black text-white font-medium text-lg rounded-full hover:bg-neutral-800 transition-colors mt-2"
      onClick={() => {
        orderHandler(market, price, quantity, orderSide, orderType);
      }}
    >
      confirm
    </button>
  );
};

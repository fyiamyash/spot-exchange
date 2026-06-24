import { ButtonForBuySellSection, BuyButton } from "../ui/BuyButton";
import { OrderType } from "../ui/OrderType";
import { AvailableBalance } from "./AvailableBalance";
import { priceStore, quantityStore, useBalanceStore } from "../store/orders";

export const BuySell = () => {
  // const [price, setPrice] = useState("");
  // const [quantity, setQuantity] = useState("");
  const price = priceStore((s) => s.price);
  const setPrice = priceStore((s) => s.setPrice);
  const quantity = quantityStore((s) => s.quantity);
  const setQuantity = quantityStore((s) => s.setQuantity);
  const balance = useBalanceStore((s) => s.balance);

  const total = (Number(price) || 0) * (Number(quantity) || 0);

  return (
    <div className="flex flex-col justify-center">
      <div className="border border-neutral-300 h-10 w-full rounded-md">
        <BuyButton />
      </div>

      <div className="flex justify-between">
        <OrderType />
        <AvailableBalance balance={balance["USD"]?.available ?? 0} />
      </div>

      <div className="w-full border border-neutral-200 rounded-2xl px-4 py-3 mt-2">
        <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
          <span>Price</span>
          <span>USDT</span>
        </div>
        <input
          value={price}
          type="number"
          onChange={(e) => setPrice(e.target.value)}
          onFocus={(e) => e.target.select()}
          placeholder="0.00"
          className="w-full text-md placeholder-neutral-300 outline-none bg-transparent"
        />
      </div>

      <div className="w-full border border-neutral-200 rounded-2xl px-4 py-3 mt-2">
        <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
          <span>Quantity</span>
        </div>
        <input
          value={quantity}
          type="number"
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="0.00"
          className="w-full text-md  placeholder-neutral-300 outline-none bg-transparent"
        />
      </div>

      <div className="w-full border border-neutral-200 rounded-2xl px-4 py-4 mt-2 flex justify-between items-center">
        <span className="text-neutral-400">Total</span>
        <span className="font-semibold text-black">{total.toFixed(2)}</span>
      </div>
      <ButtonForBuySellSection />
    </div>
  );
};

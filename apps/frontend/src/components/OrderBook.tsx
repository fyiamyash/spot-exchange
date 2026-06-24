import { orderBookStore } from "../store/orderbookStore";
import { OrderBookEntry } from "../ui/OrderBookEntry";

export const OrderBook = () => {
  const askFromStore = orderBookStore((state) => state.ask);
  const bidFromStore = orderBookStore((state) => state.bid);
  const lastTradedPrice = orderBookStore((state) => state.lastTradedPrice);

  const asks = [...askFromStore].sort((a, b) => a[0] - b[0]);
  const bids = [...bidFromStore].sort((a, b) => b[0] - a[0]);

  const totalAskQty = asks.reduce((s, [, q]) => s + q, 0);
  const totalBidQty = bids.reduce((s, [, q]) => s + q, 0);

  let askCumulative = 0;
  const asksWithDepth = asks
    .map(([p, q]) => {
      askCumulative += q;
      return {
        price: p,
        qty: q,
        cumulative: askCumulative,
        depth: (askCumulative / totalAskQty) * 100,
      };
    })
    .reverse();

  let bidCumulative = 0;
  const bidsWithDepth = bids.map(([p, q]) => {
    bidCumulative += q;
    return {
      price: p,
      qty: q,
      cumulative: bidCumulative,
      depth: (bidCumulative / totalBidQty) * 100,
    };
  });

  const bestAsk = asks.at(-1)?.[0];
  const bestBid = bids[0]?.[0];
  const spread = bestAsk && bestBid ? (bestAsk - bestBid).toFixed(1) : "—";
  return (
    <div className="border border-slate-300  w-full h-full rounded-lg overflow-hidden flex flex-col bg-white">
      <div className="px-3 py-2 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-800 hover:bg-slate-200 hover:border border-slate-100 rounded m-1 p-1">
          Order Book
        </span>
      </div>

      <div className="grid grid-cols-3 px-2 py-1 text-xs border-b border-slate-100 ">
        <span>Price(USD)</span>
        <span className="text-center">Size</span>
        <span className="text-right">Total</span>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col">
        <div className="flex flex-col justify-end flex-1">
          {asksWithDepth.map(({ price, qty, cumulative, depth }) => (
            <OrderBookEntry
              key={price}
              priceLevel={price}
              size={qty}
              cumulative={cumulative}
              side="ask"
              depthPercent={depth}
            />
          ))}
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border-y border-slate-200 ">
          <span className="text-sm font-medium text-red-600 text-red-800 tabular-nums">
            {lastTradedPrice}
          </span>
          <span className="text-xs text-red-900">Spread {spread}</span>
        </div>

        <div className="flex-1">
          {bidsWithDepth.map(({ price, qty, cumulative, depth }) => (
            <OrderBookEntry
              key={price}
              priceLevel={price}
              size={qty}
              cumulative={cumulative}
              side="bids"
              depthPercent={depth}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface OrderBookEntryProps {
  priceLevel: number;
  cumulative: number;
  side: "ask" | "bids";
  depthPercent: number;
  size: number;
}

export const OrderBookEntry = ({
  priceLevel,
  size,
  cumulative,
  side,
  depthPercent,
}: OrderBookEntryProps) => {
  const isAsk = side === "ask";
  return (
    <div className="relative w-full h-6 grid grid-cols-3 text-xs items-center px-2 cursor-default select-none border-b border-slate-50 group">
      <div
        className={`absolute top-0 bottom-0 right-0 ${isAsk ? "bg-red-200" : "bg-green-100"}`}
        style={{ width: `${depthPercent}%` }}
      />
      <div className="absolute inset-0 border-y border-dashed border-slate-200 opacity-0 group-hover:opacity-100 pointer-events-none" />
      <span
        className={`relative z-10 font-mono tabular-nums ${isAsk ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-500"}`}
      >
        {priceLevel.toFixed(2)}
      </span>
      <span className="relative z-10 font-mono tabular-nums text-center text-slate-600 dark:text-slate-400">
        {size}
      </span>
      <span className="relative z-10 font-mono tabular-nums text-right text-slate-500 dark:text-slate-500">
        {cumulative}
      </span>
    </div>
  );
};

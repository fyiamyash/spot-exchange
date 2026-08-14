const GRID_COLS = "grid-cols-[1fr_1fr_1fr_1fr_1fr_1.5fr_1fr]";

export const OrdersTableHeader = () => {
  return (
    <div
      className={`grid ${GRID_COLS} items-center gap-4 border-b border-gray-100 px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-400`}
    >
      <span>Market</span>
      <span>Price</span>
      <span>Quantity</span>
      <span>Filled</span>
      <span>Status</span>
      <span className="text-center">Created</span>
      <span className="text-right">Action</span>
    </div>
  );
};
const formatNum = (value: number | string | undefined | null) => {
  const num = Number(value ?? 0);
  return Number.isFinite(num) ? num.toFixed(2) : "0.00";
};
export const FillsTableHeader = () => (
  <div className="grid grid-cols-4 border-b border-gray-200 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
    <span>Market</span>
    <span className="text-center">Price</span>
    <span className="text-center">Quantity</span>
    <span className="text-right">Created</span>
  </div>
);

const UpRightIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
    />
  </svg>
);

const DownRightIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m4.5 4.5 15 15m0 0V8.25m0 11.25H8.25"
    />
  </svg>
);

const SideIndicator = ({ side, market }: { side: string; market: string }) => {
  const isBuy = side?.toLowerCase() === "bid";
  const label = isBuy ? "BUY" : "SELL";

  return (
    <div className="group flex items-center gap-2">
      <span
        className={`flex size-7 items-center justify-center rounded-full transition-colors ${
          isBuy
            ? "bg-green-50 text-green-600 group-hover:bg-green-100"
            : "bg-red-50 text-red-500 group-hover:bg-red-100"
        }`}
      >
        {isBuy ? (
          <UpRightIcon className="size-4" />
        ) : (
          <DownRightIcon className="size-4" />
        )}
      </span>
      <span className="flex flex-col leading-tight gap-1">
        <span className="font-medium text-gray-900">{market}</span>
        <span
          className={`text-[11px] font-semibold ${
            isBuy ? "text-green-600" : "text-red-500"
          }`}
        >
          {label}
        </span>
      </span>
    </div>
  );
};

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> =
  {
    pending: {
      bg: "bg-orange-50",
      text: "text-orange-600",
      dot: "bg-orange-500",
    },
    partial: { bg: "bg-gray-100", text: "text-gray-900", dot: "bg-gray-900" },
    filled: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-600" },
    cancelled: { bg: "bg-gray-100", text: "text-gray-500", dot: "bg-gray-400" },
  };

const StatusPill = ({ status }: { status: string }) => {
  const style = STATUS_STYLES[status?.toLowerCase()] ?? {
    bg: "bg-gray-100",
    text: "text-gray-600",
    dot: "bg-gray-400",
  };

  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${style.bg} ${style.text}`}
    >
      <span className={`size-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
};

// ---------- Orders ----------

type openOrder = {
  market: string;
  price: number;
  quantity: number;
  status: string;
  filledQuantity?: number | string;
  createdAt: string;
  orderId: string;
  side: string;
  onCancel?: (orderId: string, side: string) => void;
};

export const OrderComponent = ({
  market,
  price,
  quantity,
  filledQuantity,
  status,
  createdAt,
  orderId,
  side,
  onCancel,
}: openOrder) => {
  const formattedDate = new Date(createdAt).toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const filledNum = Number(filledQuantity ?? 0);
  const pct = quantity > 0 ? Math.min((filledNum / quantity) * 100, 100) : 0;

  return (
    <div
      className={`group grid ${GRID_COLS} items-center gap-4 border-b border-gray-100 px-4 py-4 text-sm transition-colors hover:bg-gray-50`}
    >
      <SideIndicator side={side} market={market} />

      <span className="font-mono text-gray-900">{price}</span>
      <span className="font-mono text-gray-900">{quantity}</span>

      <span className="flex items-center gap-2">
        <span className="font-mono text-gray-900">
          {/* {formatNum(filledQuantity)} */}
          {formatNum(filledQuantity) ?? "0.00"}
        </span>
        <span className="h-1 w-10 overflow-hidden rounded-full bg-gray-100">
          <span
            className="block h-full rounded-full bg-gray-900"
            style={{ width: `${pct}%` }}
          />
        </span>
      </span>

      <StatusPill status={status} />

      <span className="text-center text-gray-400">{formattedDate}</span>

      <span className="flex justify-end">
        {onCancel && (
          <button
            onClick={() => onCancel?.(orderId, side)}
            className="flex items-center gap-1 rounded-full border border-gray-200 px-2 py-1 text-xs text-gray-700 opacity-0 transition-colors hover:bg-gray-50 group-hover:opacity-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="size-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
            Cancel
          </button>
        )}
      </span>
    </div>
  );
};

type fillsComponentType = {
  market: string;
  price: number;
  quantity: number;
  createdAt: string;
};

export const FillComponent = ({
  market,
  price,
  quantity,
  createdAt,
}: fillsComponentType) => {
  const formattedDate = new Date(createdAt).toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <div className="grid grid-cols-4 items-center border-b border-gray-100 px-5 py-4 text-sm hover:bg-gray-50 transition-colors">
      <span className="font-medium text-gray-900">{market}</span>

      <span className="text-center font-medium text-gray-900">{price}</span>

      <span className="text-center text-gray-700">{quantity}</span>

      <span className="text-right text-gray-500">{formattedDate}</span>
    </div>
  );
};

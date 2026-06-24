// const GRID_COLS = "grid-cols-[0.9fr_0.7fr_1fr_0.6fr_0.7fr_1.6fr_0.5fr]";
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
export const FillsTableHeader = () => (
  <div className="grid grid-cols-4 border-b border-gray-200 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
    <span>Market</span>
    <span className="text-center">Price</span>
    <span className="text-center">Quantity</span>
    <span className="text-right">Created</span>
  </div>
);

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
  return (
    <div
      className={`grid ${GRID_COLS} items-center gap-4 border-b border-gray-100 px-4 py-4 text-sm`}
    >
      <span className="font-medium text-gray-900">{market}</span>

      <span className="text-gray-900">{price}</span>
      <span className="text-gray-900">{quantity}</span>
      <span className="text-gray-900">{filledQuantity ?? "-"}</span>

      <span className="text-gray-900">{status}</span>
      <span className="text-gray-400 text-center">{formattedDate}</span>
      <span className="flex justify-end">
        {onCancel && (
          <button
            onClick={() => onCancel?.(orderId, side)}
            className="flex items-center gap-1 rounded-full border border-gray-200 px-2 py-1 text-xs text-gray-700 transition-colors hover:bg-gray-50"
          >
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

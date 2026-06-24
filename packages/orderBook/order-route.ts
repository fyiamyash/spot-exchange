type openOrdersType = {
  orderId: string;
  userId: string;
  availableQuantity: number;
  filledQuantity: number;
  createdAt: string;
};

export type priceLevelType = {
  totalAvailable: number;
  openOrders: openOrdersType[];
};

export type fillsType = {
  price: number;
  quantity: number;

  makerOrderId: string;
  makerSide: orderSideType;
  makerId: string;

  takerOrderId: string;
  takerSide: orderSideType;
  takerId: string;

  market: string;

  createdAt: string;
};
export type engineResponse = {
  status: boolean;
  reason?: string;
  createdOrder?: number;
  fills?: fillsType[];
  balance?: {};
  cancel?: string;
};

export type matchineEngineEvent =
  | "create_order"
  | "cancel_order"
  | "add_market";

export type orderSideType = "ASK" | "BID";

export type orderTypeType = "LIMIT" | "MARKET";

export type incomingOrderType = {
  userId: string;
  orderId: string;
  price: number;
  quantity: number;
  side: orderSideType;
  type: orderTypeType;
  market: string;
};

// freshbook for deltas :
// type freshBookSide = Record<number, number>;
type delta = {
  ask: [number, number][];
  bid: [number, number][];
  lastTradedPrice: number;
};
export type freshBookType = Record<string, delta>;

export type backendRequest =
  | "create_order"
  | "cancel_order"
  | "add_market"
  | "add_user"
  | "get_userBalance"
  | "add_balance";

export type orderStatus =
  | "FILLED"
  | "PARTIALLY_FILLED"
  | "CANCELLED"
  | "PENDING";

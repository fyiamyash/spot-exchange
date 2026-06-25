import { useEffect, useState } from "react";
import { useGetDataFromDb } from "../hooks/getTrades";
import {
  fillsStore,
  openOrdersStore,
  orderHistoryStore,
} from "../store/trades";
import {
  OrdersTableHeader,
  FillsTableHeader,
  FillComponent,
  OrderComponent,
} from "../ui/EntryComponent";
import axios from "axios";

const TABS = ["Open Orders", "Fills", "Order History"] as const;
type Tab = (typeof TABS)[number];

const EMPTY_STATE: Record<Tab, string> = {
  "Open Orders": "No open orders",
  Fills: "No fills",
  "Order History": "No order history",
};

export const TradeBox = () => {
  const [activeTab, setActiveTab] = useState<Tab>("Open Orders");
  const { dataFromDb } = useGetDataFromDb();
  const setfills = fillsStore((state) => state.setInitialFills);
  const fillsValue = fillsStore((s) => s.initialFills);
  const setOpneOrders = openOrdersStore((s) => s.setOpenOrders);
  const openOrdersValue = openOrdersStore((s) => s.initialOpenOrders);
  const setOrderHistory = orderHistoryStore((s) => s.setOrderHistory);
  const orderHistoryValue = orderHistoryStore((s) => s.initialOrders);

  async function onCancelHandler(
    orderId: string,
    market: string,
    side: string,
    price: string,
  ) {
    console.log(orderId, market, side, price);
    await axios.delete("http://localhost:3000/cancelOrder", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data: {
        orderId: orderId,
        market: market,
        side: side,
        price: price,
      },
    });
  }

  useEffect(() => {
    const retrieveData = async () => {
      const result = await dataFromDb(activeTab);
      console.log(result);
      if (activeTab === "Fills") {
        setfills(result.Fills);
      } else if (activeTab === "Open Orders") {
        setOpneOrders(result.openOrders);
      } else {
        setOrderHistory(result.orderHistory);
      }
    };
    retrieveData();
  }, [activeTab]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="flex gap-7 border-b border-gray-200 px-5">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative py-4 text-[15px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 rounded-sm ${
              activeTab === tab
                ? "text-gray-900"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute inset-x-0 -bottom-px h-[2px] bg-gray-900" />
            )}
          </button>
        ))}
      </div>

      {activeTab === "Open Orders" && (
        <div>
          {openOrdersValue.length > 0 ? (
            <div>
              <div className="sticky top-0 z-10 bg-white">
                <OrdersTableHeader />
              </div>
              <div className="max-h-[180px] overflow-y-auto">
                {openOrdersValue.map((e, i) => {
                  return (
                    <OrderComponent
                      key={i}
                      createdAt={e.createdAt}
                      filledQuantity={e.filledQuantity}
                      quantity={e.quantity}
                      price={e.price}
                      market={e.market}
                      status={e.status}
                      orderId={e.id}
                      side={e.side}
                      onCancel={(orderId, orderSide) => {
                        onCancelHandler(
                          orderId,
                          e.market,
                          orderSide,
                          String(e.price),
                        );
                      }}
                    />
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex h-44 items-center justify-center">
              <p className="text-[15px] text-gray-400">
                {EMPTY_STATE[activeTab]}
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === "Order History" && (
        <div>
          {orderHistoryValue.length > 0 ? (
            <div>
              <div className="sticky top-0 z-10 bg-white">
                <OrdersTableHeader />
              </div>
              <div className="max-h-[180px] overflow-y-auto">
                {orderHistoryValue.map((e) => {
                  return (
                    <OrderComponent
                      key={e.id}
                      market={e.market}
                      price={e.price}
                      quantity={e.quantity}
                      status={e.status}
                      filledQuantity={e.filledQuantity}
                      createdAt={e.createdAt}
                      orderId=""
                      side={e.side}
                    />
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex h-44 items-center justify-center">
              <p className="text-[15px] text-gray-400">
                {EMPTY_STATE[activeTab]}
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === "Fills" && (
        <div>
          {fillsValue.length > 0 ? (
            <div>
              <div className="sticky top-0 z-10 bg-white">
                <FillsTableHeader />
              </div>
              <div className="max-h-[180px] overflow-y-auto">
                {fillsValue.map((e, i) => {
                  return (
                    <FillComponent
                      key={i}
                      market={e.market}
                      price={e.price}
                      quantity={e.quantity}
                      createdAt={e.createdAt}
                    />
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex h-44 items-center justify-center">
              <p className="text-[15px] text-gray-400">
                {EMPTY_STATE[activeTab]}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

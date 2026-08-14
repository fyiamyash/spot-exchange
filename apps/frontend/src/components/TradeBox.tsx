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
import { sessionStore } from "../store/buttonStore";
import { showToast } from "./Toast";

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
  const setShowRelogin = sessionStore((s) => s.setShowRelogin);
  const setfills = fillsStore((state) => state.setInitialFills);
  const fillsValue = fillsStore((s) => s.initialFills);
  const setOpneOrders = openOrdersStore((s) => s.setOpenOrders);
  const openOrdersValue = openOrdersStore((s) => s.initialOpenOrders);
  const setOrderHistory = orderHistoryStore((s) => s.setOrderHistory);
  const orderHistoryValue = orderHistoryStore((s) => s.initialOrders);
  const [refresh] = useState(0);

  async function onCancelHandler(
    orderId: string,
    market: string,
    side: string,
    price: string,
  ) {
    try {
      const response = await axios.delete("http://backend:3000/cancelOrder", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: {
          orderId,
          market,
          side,
          price,
        },
      });

      if (response.status === 200) {
        showToast("Order cancelled successfully", "success");
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        setShowRelogin(true);
        return;
      }

      console.error("Cancel order failed:", error);
      showToast("Failed to cancel order", "error");
    }
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
  }, [activeTab, refresh]);

  const tabCount = (tab: Tab) => {
    if (tab === "Open Orders") return openOrdersValue.length;
    if (tab === "Fills") return fillsValue.length;
    return orderHistoryValue.length;
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-1">
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            const count = tabCount(tab);

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[14px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 ${
                  isActive
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
                {isActive && count > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[12px] font-semibold text-gray-700 shadow-sm">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
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

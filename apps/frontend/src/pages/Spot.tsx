import { AssetBar } from "../components/AssetBar";
import { OrderBook } from "../components/OrderBook";
import { candlesStore, orderBookStore } from "../store/orderbookStore";
import { BuySell } from "../components/BuySell";
import { TradeBox } from "../components/TradeBox";
import { useEffect } from "react";
import { assetStore } from "../store/orders";
import ChartComponent from "../components/ChartComponent";
import { ReloginPopup } from "../components/ReloginPopup";
import { sessionStore } from "../store/buttonStore";
import { Toast } from "../components/Toast";

export const Spot = () => {
  const selectedAsset = assetStore((s) => s.symbol);
  const setFills = candlesStore((s) => s.updateFill);

  const showRelogin = sessionStore((s) => s.showRelogin);
  useEffect(() => {
    const wss = new WebSocket("ws://localhost:8080");

    const messagePayLoad = {
      type: "subscribe",
      payload: {
        market: selectedAsset,
      },
    };

    wss.onopen = () => {
      wss.send(JSON.stringify(messagePayLoad));
    };

    wss.onmessage = (event) => {
      const store = JSON.parse(event.data);

      if (store.fillsForCandles?.length > 0) {
        const fills = store.fillsForCandles.flat().map((fill: any) => ({
          createdAt: fill.createdAt,
          price: fill.price,
          quantity: fill.quantity,
        }));

        setFills(fills);
      }
      console.log("WebSocket message:", store);
      if (store.sendFbookToFrontend) {
        orderBookStore.setState(store.sendFbookToFrontend);
      }
    };

    wss.onclose = () => {
      console.log("disconnected to the server");
    };

    return () => {
      wss.close();
    };
  }, [selectedAsset, setFills]);

  return (
    <div className="h-[100dvh] w-full overflow-hidden bg-slate-50">
      <div className="flex h-full min-h-0 flex-col gap-2 p-2 sm:p-3">
        <div className="shrink-0">
          <AssetBar />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto md:overflow-hidden">
          <div className="grid grid-cols-1 gap-3 pb-3 md:h-full md:grid-cols-7 md:gap-2 md:pb-0">
            <div className="order-1 h-[500px] min-h-0 overflow-hidden rounded-lg border border-slate-300 bg-white md:order-2 md:col-span-2 md:h-full">
              <OrderBook />
            </div>

            <div className="order-2 h-[500px] min-h-0 overflow-hidden rounded-lg border border-slate-300 bg-white p-3 md:order-3 md:col-span-2 md:h-full">
              <BuySell />
            </div>

            <div className="order-3 h-[500px] min-h-0 overflow-hidden rounded-lg border border-slate-300 bg-white md:order-1 md:col-span-3 md:h-full">
              <ChartComponent />
            </div>

            <div className="order-4 min-h-[300px] overflow-hidden rounded-lg border border-slate-300 bg-white md:col-span-7 md:h-[220px]">
              <TradeBox />
            </div>
          </div>
          <Toast />
        </div>
      </div>
      {showRelogin && <ReloginPopup />}
    </div>
  );
};

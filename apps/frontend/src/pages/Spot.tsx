// import { useEffect } from "react";
import { AssetBar } from "../components/AssetBar";
import { OrderBook } from "../components/OrderBook";
import { orderBookStore } from "../store/orderbookStore";
import { BuySell } from "../components/BuySell";
import { TradeBox } from "../components/TradeBox";
import { useEffect } from "react";
import { assetStore } from "../store/orders";
import { transitionStore } from "../store/buttonStore";
import ChartComponent from "../components/ChartComponent";

export const Spot = () => {
  const selectedAsset = assetStore((s) => s.symbol);
  const isTransition = transitionStore((s) => s.isOpen);
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
      wss.onmessage = (event) => {
        let store = JSON.parse(event.data);
        console.log(store);
        orderBookStore.setState(store);
      };
    };

    wss.onclose = () => {
      console.log("disconnected to the server");
    };

    return () => {
      wss.close();
    };
  }, []);

  return (
    <div className="h-screen w-screen bg-gray-50 p-2">
      {isTransition && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent" />
        </div>
      )}

      <div className="flex h-full flex-col gap-2">
        <div>
          <AssetBar />
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <div className="grid flex-1 grid-cols-7 gap-2">
            <div className="col-span-5">
              <div className="grid h-full grid-cols-5 gap-2">
                <div className="col-span-3 rounded-lg border bg-white">
                  <ChartComponent />
                </div>

                <div className="col-span-2 overflow-hidden rounded-lg border bg-white">
                  <OrderBook />
                </div>
              </div>
            </div>

            <div className="col-span-2 overflow-hidden rounded-lg border border-slate-400 bg-white p-4">
              <BuySell />
            </div>
          </div>

          <div className="rounded-lg border bg-white">
            <TradeBox />
          </div>
        </div>
      </div>
    </div>
  );
};

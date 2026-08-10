// import { useEffect, useRef } from "react";
// import { createChart, CandlestickSeries } from "lightweight-charts";
// import { candlesStore } from "../store/orderbookStore";
// function createCandles(fills: any) {
//   const candles = new Map();

//   for (const fill of fills) {
//     const timestamp = new Date(fill.createdAt).getTime();

//     // 1-minute candle
//     const candleTime = Math.floor(timestamp / 60000) * 60;

//     const existing = candles.get(candleTime);

//     if (!existing) {
//       candles.set(candleTime, {
//         time: candleTime,
//         open: fill.price,
//         high: fill.price,
//         low: fill.price,
//         close: fill.price,
//       });
//     } else {
//       existing.high = Math.max(existing.high, fill.price);
//       existing.low = Math.min(existing.low, fill.price);
//       existing.close = fill.price;
//     }
//   }

//   return Array.from(candles.values()).sort((a, b) => a.time - b.time);
// }

// export default function TradingChart() {
//   const chartRef = useRef<HTMLDivElement>(null);
//   const fills = candlesStore((s) => s.fills);
//   useEffect(() => {
//     if (!chartRef.current) return;

//     const chart = createChart(chartRef.current, {
//       width: chartRef.current.clientWidth,
//       height: 500,
//     });
//     const flatFills = fills.flat();
//     const candles = createCandles(flatFills);

//     const candlestickSeries = chart.addSeries(CandlestickSeries);

//     candlestickSeries.setData(candles);

//     // candlestickSeries.setData([
//     //   {
//     //     time: "2026-06-21",
//     //     open: 100,
//     //     high: 120,
//     //     low: 95,
//     //     close: 110,
//     //   },
//     //   {
//     //     time: "2026-06-22",
//     //     open: 110,
//     //     high: 130,
//     //     low: 105,
//     //     close: 125,
//     //   },
//     //   {
//     //     time: "2026-06-23",
//     //     open: 125,
//     //     high: 140,
//     //     low: 120,
//     //     close: 128,
//     //   },
//     //   {
//     //     time: "2026-07-24",
//     //     open: 128,
//     //     high: 135,
//     //     low: 118,
//     //     close: 122,
//     //   },
//     // ]);

//     const resizeHandler = () => {
//       if (!chartRef.current) return;

//       chart.resize(chartRef.current.clientWidth, 500);
//     };

//     window.addEventListener("resize", resizeHandler);

//     return () => {
//       window.removeEventListener("resize", resizeHandler);
//       chart.remove();
//     };
//   }, [fills]);

//   return <div ref={chartRef} className="w-full" />;
// }

import { useEffect, useRef } from "react";
import { createChart, CandlestickSeries } from "lightweight-charts";
import { candlesStore } from "../store/orderbookStore";

function createCandles(fills: any[]) {
  const candles = new Map();

  for (const fill of fills) {
    const timestamp = new Date(fill.createdAt).getTime();
    const candleTime = Math.floor(timestamp / 60000) * 60;

    const existing = candles.get(candleTime);

    if (!existing) {
      candles.set(candleTime, {
        time: candleTime,
        open: fill.price,
        high: fill.price,
        low: fill.price,
        close: fill.price,
      });
    } else {
      existing.high = Math.max(existing.high, fill.price);
      existing.low = Math.min(existing.low, fill.price);
      existing.close = fill.price;
    }
  }

  return Array.from(candles.values()).sort((a: any, b: any) => a.time - b.time);
}

export default function TradingChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<any>(null);
  const candleSeries = useRef<any>(null);

  const fills = candlesStore((s) => s.fills);

  useEffect(() => {
    if (!chartRef.current) return;

    const container = chartRef.current;

    const chart = createChart(container, {
      width: container.clientWidth,
      height: container.clientHeight,
      layout: {
        background: {
          color: "#ffffff",
        },
        textColor: "#000000",
      },
      grid: {
        vertLines: {
          color: "#eeeeee",
        },
        horzLines: {
          color: "#eeeeee",
        },
      },
      rightPriceScale: {
        borderColor: "#dddddd",
      },
      timeScale: {
        borderColor: "#dddddd",
      },
    });

    const series = chart.addSeries(CandlestickSeries);

    chartInstance.current = chart;
    candleSeries.current = series;

    const resizeObserver = new ResizeObserver(() => {
      if (!chartRef.current || !chartInstance.current) return;

      chartInstance.current.resize(
        chartRef.current.clientWidth,
        chartRef.current.clientHeight,
      );
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
      chartInstance.current = null;
      candleSeries.current = null;
    };
  }, []);

  useEffect(() => {
    if (!candleSeries.current) return;

    const flatFills = fills.flat();
    const candles = createCandles(flatFills);

    candleSeries.current.setData(candles);
  }, [fills]);

  return <div ref={chartRef} className="h-full w-full" />;
}

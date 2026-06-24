import { useEffect, useRef } from "react";
import { createChart, CandlestickSeries } from "lightweight-charts";

export default function TradingChart() {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = createChart(chartRef.current, {
      width: chartRef.current.clientWidth,
      height: 500,
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries);

    candlestickSeries.setData([
      {
        time: "2025-01-01",
        open: 100,
        high: 120,
        low: 95,
        close: 110,
      },
      {
        time: "2025-01-02",
        open: 110,
        high: 130,
        low: 105,
        close: 125,
      },
      {
        time: "2025-01-03",
        open: 125,
        high: 140,
        low: 120,
        close: 128,
      },
      {
        time: "2025-01-04",
        open: 128,
        high: 135,
        low: 118,
        close: 122,
      },
    ]);

    const resizeHandler = () => {
      if (!chartRef.current) return;

      chart.resize(chartRef.current.clientWidth, 500);
    };

    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
      chart.remove();
    };
  }, []);

  return <div ref={chartRef} className="w-full" />;
}

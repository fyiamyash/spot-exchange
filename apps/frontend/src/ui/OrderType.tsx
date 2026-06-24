import { useState } from "react";
import { orderTypeStore } from "../store/orders";

export const OrderType = () => {
  // const [active, setActive] = useState<"LIMIT" | "MARKET">("LIMIT");
  const active = orderTypeStore((s) => s.otype);
  const setActive = orderTypeStore((s) => s.setOtype);
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-fit mt-2 border border-slate-300 rounded-md">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 px-3 py-1.5 bg-stone-50 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700 transition-colors"
      >
        {active === "LIMIT" ? "Limit" : "Market"}
        <svg
          className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full mt-1 left-0 bg-white border border-slate-200 rounded-lg shadow-md z-50 w-32 overflow-hidden">
          {(["LIMIT", "MARKET"] as const).map((type) => (
            <button
              key={type}
              onClick={() => {
                setActive(type);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-slate-50 ${
                active === type
                  ? "text-green-600 font-medium"
                  : "text-slate-600"
              }`}
            >
              {type === "LIMIT" ? "Limit" : "Market"}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

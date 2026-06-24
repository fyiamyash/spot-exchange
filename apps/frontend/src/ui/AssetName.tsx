import { useState } from "react";
import { assetStore } from "../store/orders";

interface AssetNameProps {
  name: string;
}

const ASSET_OPTIONS = ["BTC", "ETH", "SOL"];

export const AssetName = ({ name }: AssetNameProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(name);

  const SetAssetName = assetStore((s) => s.setSymbol);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 w-25 h-10 bg-white border border-neutral-200 font-sans font-semibold text-md mx-3 mt-1 px-4 rounded-full hover:bg-neutral-100 transition-colors"
      >
        {selected}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-neutral-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-3 mt-1 w-38 bg-white border border-neutral-200 rounded-xl shadow-lg overflow-hidden z-10">
          {ASSET_OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => {
                setSelected(option);
                SetAssetName(option);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-base font-semibold hover:bg-neutral-100 transition-colors ${
                option === selected ? "bg-neutral-50" : ""
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

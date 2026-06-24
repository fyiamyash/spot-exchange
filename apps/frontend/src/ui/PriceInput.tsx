interface PriceInputProps {
  label: string;
  unit: string;
  value: string;
  onChange: (value: string) => void;
}

export const PriceInput = ({
  label,
  unit,
  value,
  onChange,
}: PriceInputProps) => {
  return (
    <div className="w-full border border-neutral-200 rounded-xl px-4 py-3 mt-2">
      <div className="flex justify-between text-xs font-semibold uppercase tracking-wider mb-1">
        <span>{label}</span>
        <span>{unit}</span>
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0.00"
        className="w-full text-2xl placeholder-neutral-300 outline-none bg-transparent"
      />
    </div>
  );
};

interface AvailableBalanceProps {
  balance: number;
}

export const AvailableBalance = ({ balance }: AvailableBalanceProps) => {
  return (
    <div className="flex justify-between w-full text-sm mt-2">
      <span className="text-neutral-400">Available</span>
      <span className="font-bold text-black">
        {balance.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}{" "}
        USDT
      </span>
    </div>
  );
};

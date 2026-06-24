interface DisplayPriceProps {
  title: string;
  price: number;
  type: "price" | "label";
}

export const DisplayPrice = ({ title, price, type }: DisplayPriceProps) => {
  const formattedValue =
    type === "price"
      ? `$${price.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : price.toLocaleString();

  return (
    <div className="w-30 h-12 flex flex-col items-center justify-center">
      <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
        {title}
      </div>
      <div className="text-lg font-medium text-black">{formattedValue}</div>
    </div>
  );
};

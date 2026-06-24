import { orderBookStore } from "../store/orderbookStore";
import { assetStore } from "../store/orders";
import { AssetName } from "../ui/AssetName";
import { DisplayPrice } from "../ui/DisplayPrice";
import { ProfileDropdown } from "../ui/userSection";

export const AssetBar = () => {
  const selectedAsset = assetStore((s) => s.symbol);
  const lastTradedPrice = orderBookStore((s) => s.lastTradedPrice);
  return (
    <div className="h-16 w-full m-1 rounded-lg flex items-center justify-between bg-neutral-50 border-1 border-neutral-300">
      <AssetName name={selectedAsset} />

      <div className="flex gap-10">
        <DisplayPrice title="Last Trade" price={lastTradedPrice} type="price" />
        <DisplayPrice title="24h Volume" price={1219} type="label" />
        <ProfileDropdown />
      </div>
    </div>
  );
};

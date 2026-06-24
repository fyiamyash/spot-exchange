interface AvailableBalanceProps {
  balance: number;
}
export const AvailableBalance = (props: AvailableBalanceProps) => {
  return (
    <div className="mt-2 font-mono tabular-nums text-xs flex justify-center items-center">
      <span>Available balance: ${props.balance}</span>
    </div>
  );
};

// components/ProfileDropdown.tsx

import { useState, useRef, useEffect } from "react";
import { transitionStore } from "../store/buttonStore";
import { useNavigate } from "react-router-dom";
import profilePic from "../assets/profilePhoto.png";
import refreshIcon from "../assets/refresh.png";
import { useOrder } from "../hooks/order";
import { useBalanceStore } from "../store/orders";

export const ProfileDropdown = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showAddBalance, setShowAddBalance] = useState(false);
  const [amount, setAmount] = useState("");
  const setTransition = transitionStore((s) => s.setTransition);
  const { getBalance } = useOrder();
  const balance = useBalanceStore((s) => s.balance);
  const setbalance = useBalanceStore((s) => s.setBalance);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setShowAddBalance(false);
        setAmount("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleAddBalance = () => {
    const num = Number(amount);
    if (!num || num <= 0) return;
    // call balance
    setAmount("");
    console.log("tests");
    setShowAddBalance(false);
  };

  const getBalanceHanlder = async () => {
    console.log("get balace called ");
    const result = await getBalance();
    setbalance(result.result);
    console.log(result.result);
  };

  const logOutHanlder = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setTransition(true);
    setTimeout(() => {
      navigate("/");
      setTransition(false);
    }, 1000);
  };

  return (
    <div className="relative p-2" ref={ref}>
      <button
        onClick={() => {
          setOpen((o) => !o);
          setShowAddBalance(false);
          setAmount("");
        }}
        className="w-10 h-10 rounded-full bg-neutral-100 border border-neutral-300 flex items-center justify-center hover:bg-neutral-200 transition-colors"
      >
        <img src={profilePic} className="w-full h-full object-cover"></img>
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-72 bg-white rounded-xl shadow-xl border border-neutral-200 z-50 overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-4 border-b border-neutral-100">
            <div className="w-9 h-9 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center">
              <img
                src={profilePic}
                className="w-full h-full object-cover"
              ></img>
            </div>
            <div>
              <p className="font-semibold text-sm text-neutral-900">trader</p>
              <p className="text-xs text-neutral-400">Signed in</p>
            </div>
          </div>

          <div className="px-4 py-3 border-b border-neutral-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 uppercase tracking-wide ">
                Balances
              </div>
              <button
                className="w-4 h-4"
                onClick={() => {
                  getBalanceHanlder();
                  console.log("refresh called");
                }}
              >
                <img src={refreshIcon}></img>
              </button>
              {!showAddBalance ? (
                <button
                  onClick={() => {
                    setShowAddBalance(true);
                    console.log(balance["USD"]?.available ?? 0);
                  }}
                  className="flex items-center gap-1 text-xs text-neutral-600 hover:text-black font-medium transition-colors"
                >
                  Add
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowAddBalance(false);
                    setAmount("");
                  }}
                  className="flex items-center gap-1 text-xs text-neutral-500 hover:text-black transition-colors"
                >
                  {/* <X size={13} /> */}
                  Cancel
                </button>
              )}
            </div>

            <div className="flex items-center justify-between bg-neutral-50 rounded-lg px-3 py-2">
              <span className="font-semibold text-sm text-neutral-900">
                USDT
              </span>
              <span className="text-sm text-neutral-500">
                {Number(balance["USD"]?.available)}
              </span>
            </div>
          </div>

          {showAddBalance && (
            <div className="px-4 py-3 border-b border-neutral-100 bg-neutral-50">
              <div className="rounded-lg bg-white border border-neutral-200 px-3 py-3 mb-3 space-y-3">
                <div>
                  <p className="text-xs text-neutral-400 uppercase tracking-wide mb-1">
                    Asset
                  </p>
                  <p className="text-sm text-neutral-400">USDT</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 uppercase tracking-wide mb-1">
                    Amount
                  </p>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    onFocus={(e) => e.target.select()}
                    placeholder="0.00"
                    className="text-sm text-neutral-400 bg-transparent outline-none w-full placeholder:text-neutral-300"
                  />
                </div>
              </div>
              <button
                onClick={handleAddBalance}
                className="w-full bg-black text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-neutral-800 transition-colors"
              >
                Add balance
              </button>
            </div>
          )}

          <div className="px-4 py-3">
            <button
              onClick={() => {
                logOutHanlder();
              }}
              className="w-20 text-center text-sm text-red-300 hover:text-red-600 hover:border border-neutral-200 text-center rounded-md font-medium transition-colors"
            >
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

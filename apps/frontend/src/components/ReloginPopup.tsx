import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sessionStore } from "../store/buttonStore";

export const ReloginPopup = () => {
  const navigate = useNavigate();
  const [isTransitioning, setTransitioning] = useState(false);
  const setShowRelogin = sessionStore((s) => s.setShowRelogin);
  const handleClick = () => {
    setTransitioning(true);
    setTimeout(() => {
      navigate("/");
      setShowRelogin(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      {isTransitioning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent" />
        </div>
      )}

      <div className="w-[420px] rounded-2xl bg-white p-10 shadow-2xl">
        <div>
          <h2 className="text-2xl font-semibold text-black">Session expired</h2>

          <p className="mt-2 text-md text-neutral-500">
            Please log in again to continue.
          </p>
        </div>

        <div className="mt-8">
          <button
            onClick={handleClick}
            className="w-full h-14 rounded-2xl bg-black text-white text-md font-medium transition-all duration-150 hover:bg-neutral-800 active:scale-[0.97] active:bg-neutral-700"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

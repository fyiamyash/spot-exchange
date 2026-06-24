import { AppBar } from "../components/AppBar";
import { Modal } from "../components/Modal";
// import { modalPopUp } from "../store/buttonStore";

export const LandingPage = () => {
  // const showModal = modalPopUp((state) => state.showModal);
  return (
    <>
      <Modal />

      <div className="min-h-screen bg-neutral-100">
        <AppBar />

        <main className="flex flex-col items-center text-center pt-28 px-6">
          <h1 className=" fade-in  text-7xl font-bold tracking-tight">
            Modern <span className="text-red-500">finance</span>.
          </h1>

          <div className="mt-10 max-w-xl">
            <p className="fade-in delay-200 text-md font-medium text-black">
              Built for traders. Designed for wealth.
            </p>

            <p className="mt-6 text-sm text-neutral-500 leading-relaxed">
              Access markets, borrow against assets, earn yield, and move
              money—all from one account.
            </p>
          </div>

          <div className="mt-32 w-full max-w-5xl border-t border-neutral-300" />

          <div className="mt-10 flex gap-16 text-base tracking-[0.2em] uppercase text-neutral-500">
            <button className="hover:text-black transition-colors">Spot</button>

            <button className="hover:text-black transition-colors">
              Futures
            </button>
          </div>
        </main>
      </div>
    </>
  );
};

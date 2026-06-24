import { useState } from "react";
import { userSignIn } from "../hooks/signInHook";
import { logInToggle, signInToggle } from "../store/buttonStore";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/loginHooks";

export const Modal = () => {
  const navigate = useNavigate();
  const { signIn } = userSignIn();
  const { logIn } = useLogin();
  const isLogInOpen = logInToggle((state) => state.isOpen);
  const setLogInOpen = logInToggle((state) => state.setIsOpen);
  const setSignInOpen = signInToggle((state) => state.setIsOpen);

  const isSignUpOpen = signInToggle((state) => state.isOpen);
  const setSignUpOpen = signInToggle((state) => state.setIsOpen);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setTransitioning] = useState(false);
  const [err, setIsErr] = useState<string | null>(null);

  if (!isLogInOpen && !isSignUpOpen) return null;

  const signInHandler = async () => {
    setIsLoading(true);
    setIsErr(null);

    try {
      const result = await signIn(email, password);
      if (result) {
        setTransitioning(true);
        setTimeout(() => {
          setSignUpOpen();
          navigate("/spot");
          setSignInOpen();
        }, 2000);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setIsErr(error.response?.data?.message ?? "Something went wrong");
      } else {
        setIsErr("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logInHandler = async () => {
    setIsErr(null);
    setIsLoading(true);
    try {
      const response = await logIn(email, password);
      if (response) {
        localStorage.setItem("token", response.authToken);
        setTransitioning(true);
        setTimeout(() => {
          navigate("/spot");
          setLogInOpen();
        }, 2000);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setIsErr(err.response?.data?.message ?? "something went wrong");
      } else {
        setIsErr("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={isLogInOpen ? setLogInOpen : setSignUpOpen}
    >
      {isTransitioning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent" />
        </div>
      )}
      {isLogInOpen && (
        <div
          className="w-[520px] rounded-2xl bg-white p-10 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-semibold text-black">
                Welcome back
              </h2>

              <p className="mt-2 text-md text-neutral-500">
                Log in to continue to.
              </p>
            </div>

            <button
              onClick={setLogInOpen}
              className="text-neutral-500 hover:text-black rounded-full hover:border w-6"
            >
              X
            </button>
          </div>

          <div className="mt-8 space-y-6">
            <div>
              <label className="block mb-2 text-base font-medium">
                Username
              </label>

              <input
                placeholder="username"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className="w-full h-14 px-5 rounded-2xl border-2 border-neutral-200 outline-none focus:border-neutral-400"
              />
            </div>

            <div>
              <label className="block mb-2 text-base font-medium">
                Password
              </label>

              <input
                type="password"
                placeholder="••••••••"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                className="w-full h-14 px-5 rounded-2xl border-2 border-neutral-200 outline-none focus:border-neutral-400"
              />
            </div>
            {err && <p className="text-sm text-red-500 -mt-2">{err}</p>}

            <button
              className="w-full h-14 rounded-2xl bg-black text-white text-md font-medium hover:bg-neutral-800 transition-colors"
              onClick={logInHandler}
            >
              {isLoading ? (
                <>
                  <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                "Log In"
              )}
            </button>
          </div>
        </div>
      )}

      {isSignUpOpen && (
        <div
          className="w-[520px] rounded-2xl bg-white p-10 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-semibold text-black">
                Create an account
              </h2>

              <p className="mt-2 text-md text-neutral-500">
                Sign up to get started with Central.
              </p>
            </div>

            <button
              onClick={setSignUpOpen}
              className="text-neutral-500 hover:text-black rounded-full hover:border w-6"
            >
              X
            </button>
          </div>

          <div className="mt-8 space-y-6">
            <div>
              <label className="block mb-2 text-base font-medium">
                Username
              </label>

              <input
                placeholder="username"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className="w-full h-14 px-5 rounded-2xl border-2 border-neutral-200 outline-none focus:border-neutral-400"
              />
            </div>

            <div>
              <label className="block mb-2 text-base font-medium">
                Password
              </label>

              <input
                type="password"
                placeholder="••••••••"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                className="w-full h-14 px-5 rounded-2xl border-2 border-neutral-200 outline-none focus:border-neutral-400"
              />
            </div>
            {err && <p className="text-sm text-red-500 -mt-2">{err}</p>}
            <button
              className="w-full h-14 rounded-2xl bg-black text-white text-md font-medium hover:bg-neutral-800 transition-colors"
              onClick={signInHandler}
            >
              {isLoading ? (
                <>
                  <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

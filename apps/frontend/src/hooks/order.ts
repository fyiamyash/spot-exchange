import axios from "axios";
import { sessionStore } from "../store/buttonStore";
import { showToast } from "../components/Toast";

export function useOrder() {
  const placeOrder = async (
    market: string,
    price: number,
    quantity: number,
    side: string,
    type: string,
  ) => {
    const incomingOrder = {
      market,
      price,
      quantity,
      side,
      type,
    };
    console.log(incomingOrder);
    try {
      const result = await axios.post(
        "http://backend:3000/createOrder",
        incomingOrder,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      if (result.status === 200) {
        showToast("Order Placed successfully");
      }

      return await result.data;
    } catch (error: any) {
      if (error.response.status === 401) {
        sessionStore.getState().setShowRelogin(true);
        return;
      }
      console.error("Get balance failed:", error);
    }
  };

  const getBalance = async () => {
    const sendToken = localStorage.getItem("token");
    try {
      const result = await axios.get("http://backend:3000/getBalance", {
        headers: {
          Authorization: `Bearer ${sendToken}`,
        },
      });

      return result;
    } catch (error: any) {
      if (error.response.status === 401) {
        sessionStore.getState().setShowRelogin(true);
        return;
      }
      console.error("Get balance failed:", error);
    }
  };
  return { placeOrder, getBalance };
}

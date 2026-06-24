import axios from "axios";

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
    const result = await axios.post(
      "http://localhost:3000/createOrder",
      incomingOrder,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    return await result.data;
  };

  const getBalance = async () => {
    const sendToken = localStorage.getItem("token");

    const result = await axios.get("http://localhost:3000/getBalance", {
      headers: {
        Authorization: `Bearer ${sendToken}`,
      },
    });
    return await result.data;
  };
  return { placeOrder, getBalance };
}

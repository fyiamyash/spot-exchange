import axios from "axios";
import { sessionStore } from "../store/buttonStore";

type tabForData = "Open Orders" | "Fills" | "Order History";

export const useGetDataFromDb = () => {
  const dataFromDb = async (tabValue: tabForData) => {
    // try {
    if (tabValue === "Open Orders") {
      try {
        const result = await axios.get("http://backend:3000/getOrder", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        return result.data;
      } catch (error: any) {
        if (error.response.status === 401) {
          sessionStore.getState().setShowRelogin(true);
          return;
        }
        console.error("Error fetching open orders from db!", error);
      }
    } else if (tabValue === "Fills") {
      try {
        const result = await axios.get("http://backend:3000/getFills", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        return result.data;
      } catch (error: any) {
        if (error.response.status === 401) {
          sessionStore.getState().setShowRelogin(true);
          return;
        }
        console.error("Error fetching Fills from db", error);
      }
    } else {
      try {
        const result = await axios.get("http://backend:3000/getOrderHistory", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        return result.data;
      } catch (error: any) {
        if (error.response.status === 401) {
          sessionStore.getState().setShowRelogin(true);
          return;
        }
        console.error("Error fetchin order history from db", error);
      }
    }
  };
  return { dataFromDb };
};

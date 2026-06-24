import axios from "axios";

type tabForData = "Open Orders" | "Fills" | "Order History";

export const useGetDataFromDb = () => {
  const dataFromDb = async (tabValue: tabForData) => {
    // try {
    if (tabValue === "Open Orders") {
      const result = await axios.get("http://localhost:3000/getOrder", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return await result.data;
    } else if (tabValue === "Fills") {
      const result = await axios.get("http://localhost:3000/getFills", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      return await result.data;
    } else {
      const result = await axios.get("http://localhost:3000/getOrderHistory", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return await result.data;
    }
    // } catch (e) {
    //   console.log("error in retrievin data", e);
    // }
  };
  return { dataFromDb };
};

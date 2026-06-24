import { Router } from "express";
import { asyncHanlder } from "../utils/asyncHandler";
import {
  addUserBalance,
  cancelOrderFunction,
  createOrderFunction,
  getBalance,
  getFillsFunction,
  getOrderFunction,
  getOrderHistoryFunction,
} from "../controller/order-route-controller";
import { authMiddleware } from "../utils/authUtils";

export const orderController = Router();

orderController.post(
  "/createOrder",
  authMiddleware,
  asyncHanlder(createOrderFunction),
);
orderController.delete(
  "/cancelOrder",
  authMiddleware,
  asyncHanlder(cancelOrderFunction),
);
orderController.get(
  "/getOrder",
  authMiddleware,
  asyncHanlder(getOrderFunction),
);
orderController.get(
  "/getOrderHistory",
  authMiddleware,
  asyncHanlder(getOrderHistoryFunction),
);
orderController.get(
  "/getFills",
  authMiddleware,
  asyncHanlder(getFillsFunction),
);

orderController.post(
  "/addUserbalance",
  authMiddleware,
  asyncHanlder(addUserBalance),
);

orderController.get("/getBalance", authMiddleware, asyncHanlder(getBalance));

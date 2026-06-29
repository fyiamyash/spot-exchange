import {
  addBalanceType,
  orderBodyType,
  type engineResponse,
  type incomingOrderType,
} from "@repo/orderbook";
import { json, type Request, type Response } from "express";
import { sendOrderToEngine } from "../utils/engine-client";
import { prisma } from "@repo/prismafordb";

export async function createOrderFunction(
  req: Request,
  res: Response,
): Promise<void> {
  console.log(req.userId);
  const changedBody = {
    userId: req.userId,
    market: req.body.market,
    price: req.body.price,
    quantity: req.body.quantity,
    side: req.body.side,
    type: req.body.type,
  };
  console.log(changedBody);
  const orderBody = orderBodyType.safeParse(changedBody);

  if (!orderBody.success) {
    res.status(411).json({ message: "Invalid body", error: orderBody.error });
    return;
  }
  const orderIdForEngine = crypto.randomUUID();
  const sendOrder: incomingOrderType = {
    ...orderBody.data,
    orderId: orderIdForEngine,
  };
  const corelationId = crypto.randomUUID();
  const resp: engineResponse = await sendOrderToEngine(
    sendOrder,
    "create_order",
    corelationId,
  );
  if (!resp.status) {
    res.status(411).json({ message: resp.reason });
    return;
  }
  res.json({
    message: resp.reason,
    fills: resp.fills,
    createdOrders: resp.createdOrder,
  });
}

export async function cancelOrderFunction(
  req: Request,
  res: Response,
): Promise<void> {
  const incomingBody: incomingOrderType = {
    ...req.body,
    userId: "",
    quantity: 0,
    type: "LIMIT",
  };
  const correaltionId = crypto.randomUUID();
  const resp: engineResponse = await sendOrderToEngine(
    incomingBody,
    "cancel_order",
    correaltionId,
  );

  if (!resp.status) {
    res.status(411).json({ message: resp.reason });
    return;
  }
  res.json({ message: resp.reason });
}

export async function getOrderFunction(
  req: Request,
  res: Response,
): Promise<void> {
  const currentOpenOrders = await prisma.orders.findMany({
    where: {
      userId: req.userId,
      status: "PENDING",
    },
  });

  res.send({ message: "Open Orders:", openOrders: currentOpenOrders });
}

export async function getOrderHistoryFunction(
  req: Request,
  res: Response,
): Promise<void> {
  const orderHistoryForCurrentUser = await prisma.orders.findMany({
    where: {
      userId: req.userId,
    },
  });

  res.send({
    message: "Order History:",
    orderHistory: orderHistoryForCurrentUser,
  });
}

export async function getFillsFunction(
  req: Request,
  res: Response,
): Promise<void> {
  const fillForCurrentUser = await prisma.fills.findMany({
    where: {
      OR: [{ makerId: req.userId }, { takerId: req.userId }],
    },
  });
  res.send({ Fills: fillForCurrentUser });
}

export async function addUserBalance(
  req: Request,
  res: Response,
): Promise<void> {
  const safeUserbalanceBody = addBalanceType.safeParse(req.body);
  if (!safeUserbalanceBody.success) {
    res
      .status(412)
      .json({ message: "Invalid type", error: safeUserbalanceBody.error });
    return;
  }
  if (!safeUserbalanceBody.data) {
    res
      .status(412)
      .json({ message: "error occured in zod body type while adding balance" });
    return;
  }
  const correaltionId = crypto.randomUUID();
  const resp: engineResponse = await sendOrderToEngine(
    safeUserbalanceBody.data,
    "add_balance",
    correaltionId,
  );

  res.json({ status: resp.status, message: resp.reason });
}

export async function getBalance(req: Request, res: Response): Promise<void> {
  const userId = req.userId;
  if (!userId) {
    res.status(409).json({ message: "Invalid UserId" });
    return;
  }
  const sendBody = {
    userId: userId,
    username: "",
    balance: {
      USD: {
        available: 0,
        locked: 0,
      },
    },
  };
  const correaltionId = crypto.randomUUID();
  const resp: engineResponse = await sendOrderToEngine(
    sendBody,
    "get_userBalance",
    correaltionId,
  );
  res.json({ status: resp.status, message: resp.reason, result: resp.balance });
}

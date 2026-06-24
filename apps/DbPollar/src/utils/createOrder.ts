import type { incomingOrderType, orderStatus } from "@repo/orderbook";
import { prisma } from "@repo/prismafordb";

export async function createOrderInDb(
  incomOrder: incomingOrderType,
  createdOrder: number,
) {
  console.log(incomOrder.userId);
  const filledQuantity = incomOrder.quantity - createdOrder;
  let statusOfOrder: orderStatus;
  if (filledQuantity == incomOrder.quantity) {
    statusOfOrder = "FILLED";
  } else if (filledQuantity == 0) {
    statusOfOrder = "PENDING";
  } else if (filledQuantity > 0 && createdOrder > 0) {
    statusOfOrder = "PARTIALLY_FILLED";
  } else {
    statusOfOrder = "CANCELLED";
  }
  try {
    let dateForDb = new Date().toISOString();
    await prisma.orders.create({
      data: {
        id: incomOrder.orderId,
        userId: incomOrder.userId,
        price: incomOrder.price,
        quantity: incomOrder.quantity,
        side: incomOrder.side,
        filledQuantity: filledQuantity,

        status: statusOfOrder,

        createdAt: dateForDb,
        market: incomOrder.market,
      },
    });
  } catch (err) {
    console.log("error while storing Orders in the Db", err);
  }
}

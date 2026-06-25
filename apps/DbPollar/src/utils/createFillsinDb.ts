import type { fillsType } from "@repo/orderbook";
import { prisma } from "@repo/prismafordb";

export function createFills(incomingFills: fillsType[]) {
  incomingFills.forEach(async (element) => {
    try {
      await prisma.fills.create({
        data: {
          id: crypto.randomUUID(),
          makerId: element.makerId,
          takerId: element.takerId,
          market: element.market,
          price: element.price,
          quantity: element.quantity,
          createdAt: element.createdAt,
        },
      });

      const existingOrder = await prisma.orders.findFirst({
        where: {
          id: element.makerOrderId,
        },
      });
      if (!existingOrder) {
        console.log("maker orderid doesnt exists!");
        return -1;
      }

      if (
        existingOrder.quantity -
          existingOrder.filledQuantity -
          element.quantity ===
        0
      ) {
        await prisma.orders.update({
          where: {
            id: existingOrder.id,
          },
          data: {
            id: existingOrder.id,
            userId: existingOrder.userId,
            price: existingOrder.price,
            quantity: existingOrder.quantity,
            side: existingOrder.side,
            filledQuantity: existingOrder.filledQuantity + element.quantity,
            status: "FILLED",
            createdAt: existingOrder.createdAt,
            market: existingOrder.market,
          },
        });
      } else if (
        existingOrder.quantity -
          existingOrder.filledQuantity -
          element.quantity >
        0
      ) {
        await prisma.orders.update({
          where: {
            id: existingOrder.id,
          },
          data: {
            id: existingOrder.id,
            userId: existingOrder.userId,
            price: existingOrder.price,
            quantity: existingOrder.quantity,
            side: existingOrder.side,
            filledQuantity: existingOrder.filledQuantity + element.quantity,
            status: existingOrder.status,
            createdAt: existingOrder.createdAt,
            market: existingOrder.market,
          },
        });
      }
    } catch (err) {
      console.log("error while storing fills in the db", err);
    }
  });
}

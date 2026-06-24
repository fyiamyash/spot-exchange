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
    } catch (err) {
      console.log("error while storing fills in the db", err);
    }
  });
}

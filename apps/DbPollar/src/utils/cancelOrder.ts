import { prisma } from "@repo/prismafordb";

export async function cancelOrderFunction(orderId: string) {
  const deleted = await prisma.orders.delete({
    where: {
      id: orderId,
    },
  });
  if (deleted) {
    return 1;
  } else {
    return -1;
  }
}

import { string, z } from "zod";

export const userBodyType = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(3),
});

const zodSideEnum = z.enum(["ASK", "BID"]);
const zodTypeEnum = z.enum(["LIMIT", "MARKET"]);

export const orderBodyType = z.object({
  userId: z.string().min(3),
  market: z.string().min(2),
  price: z.number(),
  quantity: z.number(),
  side: zodSideEnum,
  type: zodTypeEnum,
});

import { string, z } from "zod";

export type userType = {
  userId: string;
  username: string;
  balance: {
    [asset: string]: {
      available: number;
      locked: number;
    };
  };
};
export const addBalanceType: z.ZodType<userType> = z.object({
  userId: z.string(),
  username: z.string(),
  balance: z.record(
    z.string(),
    z.object({
      available: z.number(),
      locked: z.number(),
    }),
  ),
});

export type addMoneyToWallet = {
  userId: string;
  asset: string;
  amount: number;
};

export type userEvent = "add_user" | "add_balance" | "get_userBalance";

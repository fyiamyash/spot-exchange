import type { userType } from "@repo/orderbook";

export const users: userType[] = [
  {
    userId: "be467ad5-f93a-4639-a5f4-4dfc93ae2645",
    username: "yash1234",
    balance: {
      USD: { available: 10000, locked: 0 },
      SOL: { available: 10, locked: 0 },
    },
  },
  {
    userId: "0fe18059-dbf4-4016-af3d-417b723e953f",
    username: "yash123",
    balance: {
      USD: { available: 10000, locked: 0 },
      SOL: { available: 10, locked: 0 },
    },
  },
  {
    userId: "2b9df9b1-6326-48fb-8abc-6fd9fe3396f3",
    username: "random123",
    balance: {
      USD: { available: 10000, locked: 0 },
      SOL: { available: 10, locked: 0 },
    },
  },
];

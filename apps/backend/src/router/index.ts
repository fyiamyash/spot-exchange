import { Router } from "express";

import { authRouter } from "./authRouter";
import { orderController } from "./order-route";

export const appRouter = Router();

appRouter.use(authRouter);
appRouter.use(orderController);

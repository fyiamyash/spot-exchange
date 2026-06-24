import { Router } from "express";
import { asyncHanlder } from "../utils/asyncHandler";
import { loginFunction, signUpFunction } from "../controller/authController";

export const authRouter = Router();

authRouter.post("/signup", asyncHanlder(signUpFunction));
authRouter.post("/login", asyncHanlder(loginFunction));

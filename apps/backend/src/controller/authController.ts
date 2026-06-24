import {
  userBodyType,
  type engineResponse,
  type userType,
} from "@repo/orderbook";
import type { Request, Response } from "express";
import { sendOrderToEngine } from "../utils/engine-client";
import { prisma } from "@repo/prismafordb";
import { generateToken } from "../utils/authUtils";
import bcrypt from "bcrypt";

export async function signUpFunction(req: Request, res: Response) {
  const safeUserBody = userBodyType.safeParse(req.body);
  if (!safeUserBody.success) {
    res
      .status(412)
      .json({ message: "Invalid user body type", error: safeUserBody.error });
    return;
  }
  // one req should go to engine to add the user!
  // one req should go to db

  const { username, password } = safeUserBody.data;
  const userExist = await prisma.user.findFirst({
    where: { username: username },
  });
  if (userExist) {
    res.status(412).json({ message: "Username already exist!" });
    return;
  }
  const userID = crypto.randomUUID();
  const correaltionId = crypto.randomUUID();
  const userData: userType = {
    userId: userID,
    username: username,
    balance: {
      USD: { available: 2000, locked: 0 },
      SOL: { available: 10, locked: 0 },
    },
  };
  const resp: engineResponse = await sendOrderToEngine(
    userData,
    "add_user",
    correaltionId,
  );
  const hashedPassword = await bcrypt.hash(password, 4);
  if (!resp.status) {
    res.status(412).json({ message: resp.reason });
    return;
  }
  await prisma.user.create({
    data: {
      id: userID,
      username: username,
      password: hashedPassword,
    },
  });

  const authToken = generateToken(username);
  res.json({ message: "user signedUp successfully", authToken: authToken });
}

export async function loginFunction(req: Request, res: Response) {
  const safeBody = userBodyType.safeParse(req.body);
  if (!safeBody.success) {
    res.status(411).json({ message: "Invalid body type", err: safeBody.error });
    return;
  }
  const { username, password } = safeBody.data;

  const userExist = await prisma.user.findFirst({
    where: {
      username: username,
    },
  });
  if (!userExist) {
    res.status(403).json({ message: "Invalid username" });
    return;
  }
  const correctPass = await bcrypt.compare(password, userExist.password);
  if (!correctPass) {
    res.status(403).json({ message: "Invalid password" });
    return;
  }
  const authToken = generateToken(userExist.id);
  res.json({ message: "logged in successfully", authToken: authToken });
  return;
}

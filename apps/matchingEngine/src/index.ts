import type {
  engineResponse,
  incomingOrderType,
  userType,
} from "@repo/orderbook";
import { matchingEngine } from "./matchingEngine";
import { userOperations } from "./userOperations";
import { users } from "./store/users";
import { stripOrderBook } from "./utils/orderFunction/stripOrderbook";
import {
  connectToReddisClient,
  listeningToBackendRequest,
} from "./utils/connectToClient";

await connectToReddisClient();
listeningToBackendRequest();

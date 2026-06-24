import { connectToRedis, listeningToEngineResponse } from "./utils/redisClient";

await connectToRedis();
listeningToEngineResponse();

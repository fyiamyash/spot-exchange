import dotenv from "dotenv";
dotenv.config();

export const envCustom = {
  port: process.env.PORT,
  redisUrl: process.env.REDIS_URL,
  secret: "batman123123",
  order_from_backend_to_Engine: "backend-to-engine-stream",
  response_Engine_to__backend: "engine-to-backend-stream",
  response_to_db_pollar: "engine-to-db-pollar-stream",
};

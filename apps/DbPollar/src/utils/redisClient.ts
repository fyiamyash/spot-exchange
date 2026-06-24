import { createClient } from "redis";
import { envCustom } from "./envCustom";
import { createFills } from "./createFillsinDb";
import { createOrderInDb } from "./createOrder";
import { cancelOrderFunction } from "./cancelOrder";

const subscriber_to_engine_response = createClient({
  url: envCustom.redisUrl,
}).on("error", (err) => {
  console.log(
    "error while connecting to the subscriber_to_engine_response ",
    err,
  );
});

export async function connectToRedis() {
  await Promise.all([subscriber_to_engine_response.connect()]);
}

export async function listeningToEngineResponse() {
  console.log("Listening to Engine response for DB");
  let lastId = "$";
  for (;;) {
    const response = (await subscriber_to_engine_response.xRead(
      [{ key: envCustom.response_to_db_pollar, id: lastId }],
      { COUNT: 1, BLOCK: 300 },
    )) as any;
    if (!response) {
      continue;
    }
    if (response) {
      const { fills, status, createdOrder, cancelOrder } = JSON.parse(
        response[0].messages[0].message.responseToBackend,
      );
      lastId = response[0].messages[0].id;
      const orderHistory = JSON.parse(
        response[0].messages[0].message.orderHistory,
      );
      if (status && fills && createdOrder) {
        if (fills.length > 0) {
          createFills(fills);
        }
        createOrderInDb(orderHistory, createdOrder);
      }
      if (status && cancelOrder) {
        cancelOrderFunction(cancelOrder);
      }
    }
  }
}

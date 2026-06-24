import { createClient } from "redis";
import { envCustom } from "./envCustom";
import type {
  backendRequest,
  engineResponse,
  incomingOrderType,
  userType,
} from "@repo/orderbook";

const promiseStoreForResponse = new Map<string, (value: unknown) => void>();

const publisher_to_engine_stream = createClient({ url: envCustom.redisUrl }).on(
  "err",
  (err) => {
    console.log(
      "Error while connecting to the publisher_to_engine_stream",
      err,
    );
  },
);

const subscriber_to_engine_response_stream = createClient({
  url: envCustom.redisUrl,
}).on("err", (err) => {
  console.log(
    "Error while connecting to the subscriber_to_engine_response_stream",
    err,
  );
});

export async function connectToClients() {
  await Promise.all([
    publisher_to_engine_stream.connect(),
    subscriber_to_engine_response_stream.connect(),
  ]);
}

export async function store_resolve_for_backend(corelationId: string) {
  return new Promise((resolve, reject) => {
    promiseStoreForResponse.set(corelationId, resolve);
    setTimeout(() => {
      if (promiseStoreForResponse.get(corelationId)) {
        promiseStoreForResponse.delete(corelationId);
        reject("Request Timeout");
      }
    }, 10000);
  });
}

export async function sendOrderToEngine(
  order: userType | incomingOrderType,
  ev: backendRequest,
  correaltionId: string,
): Promise<any> {
  const orderForEngine = JSON.stringify(order);
  const offSetId = await publisher_to_engine_stream.xAdd(
    envCustom.order_from_backend_to_Engine,
    "*",
    { correaltionId, ev, orderForEngine },
  );
  console.log(`Request sent to engine with offset id: ${offSetId}`);
  const resultFromEngine = await store_resolve_for_backend(correaltionId);
  return resultFromEngine;
}

export async function listeningToEngineRespone() {
  console.log("listening to response coming from engine ");
  let lastMessageId = "$";
  for (;;) {
    const response_coming_From_Engine =
      (await subscriber_to_engine_response_stream.xRead(
        [
          {
            key: envCustom.response_Engine_to__backend,
            id: lastMessageId,
          },
        ],
        { BLOCK: 200, COUNT: 1 },
      )) as any;

    if (!response_coming_From_Engine) {
      continue;
    }
    for (let data of response_coming_From_Engine) {
      const correaltionId = data.messages[0].message.correaltionId;
      lastMessageId = data.messages[0].id;
      const parsedResponse = JSON.parse(
        data.messages[0].message.responseToBackend,
      );
      let resolveFunction = promiseStoreForResponse.get(correaltionId);
      if (resolveFunction) {
        resolveFunction(parsedResponse);
        promiseStoreForResponse.delete(correaltionId);
      }
    }
  }
}

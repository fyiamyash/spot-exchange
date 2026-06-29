import { createClient } from "redis";
import { envCustom } from "./envCustom";
import type { backendRequest, engineResponse } from "@repo/orderbook";
import { userOperations } from "../userOperations";
import { matchingEngine } from "../matchingEngine";
import { freshbookForFrontEnd, OrderBooks } from "../store/orderbook";
import { stripOrderBook } from "./orderFunction/stripOrderbook";

import { S3Client, PutObjectCommand, Bucket$ } from "@aws-sdk/client-s3";

const s3Object = new S3Client({
  endpoint: "http://localhost:9000",
  region: "us-east-1",
  credentials: { accessKeyId: "admin", secretAccessKey: "password123" },
  forcePathStyle: true,
});

const subscriber_to_order_coming_from_backend = createClient({ url: "" }).on(
  "err",
  (err) => {
    console.log(
      "error connecting to the  subscriber_to_order_coming_from_backend",
      err,
    );
  },
);

const publisher_to_response_from_engine_to_backend = createClient({
  url: "",
}).on("err", (err) => {
  console.log(
    "error connecting to the  subscriber_to_order_coming_from_backend",
    err,
  );
});

const publisher_to_db_pollar = createClient({
  url: envCustom.redisUrl,
}).on("error", (err) => {
  console.log("error connecting to the  publisher_to_db_pollar", err);
});

const publisher_to_webSocket_for_FrontEnd = createClient({
  url: envCustom.redisUrl,
}).on("error", (err) => {
  console.log("error while creating the publisher_to_webSocket_for_FrontEnd");
});

export async function connectToReddisClient() {
  console.log("connected to Redis clients");
  await Promise.all([
    subscriber_to_order_coming_from_backend.connect(),
    publisher_to_response_from_engine_to_backend.connect(),
    publisher_to_db_pollar.connect(),
    publisher_to_webSocket_for_FrontEnd.connect(),
  ]);
}

async function saveOrderBookToObjectStore() {
  const saveData = new PutObjectCommand({
    Bucket: "spot",
    Key: `orderbook@${Date.now()}.json`,
    Body: JSON.stringify(OrderBooks),
    ContentType: "application/json",
  });

  await s3Object.send(saveData);
}

export async function listeningToBackendRequest() {
  console.log("listening to backend requests!");

  try {
    setInterval(() => {
      saveOrderBookToObjectStore();
    }, 300000);

    const createGroup =
      await subscriber_to_order_coming_from_backend.xGroupCreate(
        envCustom.order_from_backend_to_Engine,
        "backend-group",
        "0",
        { MKSTREAM: true },
      );
  } catch (e) {
    console.log("consumer group already exists, skipping now-");
  }

  for (;;) {
    // const responseFromBackend =
    //   (await subscriber_to_order_coming_from_backend.xRead(
    //     [{ key: envCustom.order_from_backend_to_Engine, id: "$" }],
    //     { COUNT: 1, BLOCK: 200 },
    //   )) as any;

    const responseFromBackend =
      await subscriber_to_order_coming_from_backend.xReadGroup(
        "backend-group",
        "backend-1",
        [
          {
            key: envCustom.order_from_backend_to_Engine,
            id: ">",
          },
        ],
        { COUNT: 1, BLOCK: 200 },
      );

    if (!responseFromBackend) {
      continue;
    }
    if (responseFromBackend) {
      console.log(
        "==== group response ----",
        typeof responseFromBackend[0]!.messages[0].id,
      );
      for (let data of responseFromBackend) {
        const messageId = responseFromBackend[0]!.messages[0].id;
        const correaltionId = data.messages[0].message.correaltionId;
        const event: backendRequest = data.messages[0].message.ev;
        const orderFromBackend = JSON.parse(
          data.messages[0].message.orderForEngine,
        );
        // checking the event:
        // user operation
        if (
          event == "add_balance" ||
          event == "add_user" ||
          event == "get_userBalance"
        ) {
          let responseToBackend = JSON.stringify(
            userOperations(event, orderFromBackend),
          );
          console.log;
          let offSetId =
            await publisher_to_response_from_engine_to_backend.xAdd(
              envCustom.response_Engine_to__backend,
              "*",
              {
                correaltionId,
                responseToBackend,
              },
              { TRIM: { strategy: "MAXLEN", threshold: 20 } },
            );
          console.log(`sending response to backend with offsetID: ${offSetId}`);
        }

        // order events:
        else if (
          event == "add_market" ||
          event == "create_order" ||
          event == "cancel_order"
        ) {
          let responseToBackend = JSON.stringify(
            matchingEngine(event, orderFromBackend),
          );
          const offSetId1 =
            await publisher_to_response_from_engine_to_backend.xAdd(
              envCustom.response_Engine_to__backend,
              "*",
              {
                correaltionId,
                responseToBackend,
              },
            );
          console.log(
            `sending response to backend with offsetID1: ${offSetId1}`,
          );

          let orderHistory = JSON.stringify(orderFromBackend);
          const offSetId2 = await publisher_to_db_pollar.xAdd(
            envCustom.response_to_db_pollar,
            "*",
            {
              orderHistory,
              responseToBackend,
            },
          );

          //acknowledging that we got the order :
          console.log("ajshaksda", messageId);
          await subscriber_to_order_coming_from_backend.xAck(
            envCustom.order_from_backend_to_Engine,
            "backend-group",
            messageId,
          );

          // deleting the message:

          await subscriber_to_order_coming_from_backend.xDel(
            envCustom.order_from_backend_to_Engine,
            messageId,
          );

          if (event === "create_order" || event === "cancel_order") {
            stripOrderBook(orderFromBackend.market);
            const sendFbook = JSON.stringify(
              freshbookForFrontEnd[orderFromBackend.market],
            );
            await publisher_to_webSocket_for_FrontEnd.set(
              orderFromBackend.market,
              sendFbook,
            );
            await publisher_to_webSocket_for_FrontEnd.publish(
              orderFromBackend.market,
              sendFbook,
            );
          }

          console.log(
            `sending response to DbPollar with offsetID: ${offSetId2}`,
          );
        }
      }
    }
  }
}

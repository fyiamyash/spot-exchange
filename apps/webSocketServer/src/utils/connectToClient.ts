import { createClient } from "redis";
import { envCustom } from "./envCustom";
import { WebSocket } from "ws";

const subscriberList = new Map<string, WebSocket[]>();
const subscribedMarket = new Set<string>();

const subscriber_to_orderBook_for_frontEnd = createClient({
  url: envCustom.redisUrl,
});

export async function connectToClient() {
  await subscriber_to_orderBook_for_frontEnd.connect();
}

export function addUserToSubscribersList(market: string, socket: WebSocket) {
  if (!subscriberList.has(market)) {
    subscriberList.set(market, []);
  }
  subscriberList.get(market)!.push(socket);
  console.log(subscriberList.get(market)?.length);
}

export function removeUserFromSubscibersList(
  market: string,
  socket: WebSocket,
) {
  if (subscriberList.has(market)) {
    let users = subscriberList.get(market);
    users = users!.filter((u) => {
      if (u == socket) {
        return false;
      }
      return true;
    });
    subscriberList.set(market, users);
    if (users.length === 0) {
      subscriber_to_orderBook_for_frontEnd.unsubscribe(market);
      subscribedMarket.delete(market);
    }
  }

  console.log(subscriberList.get(market)?.length);
}

export async function getFreshBook(market: string) {
  const book = await subscriber_to_orderBook_for_frontEnd.get(market);
  if (!book) {
    return -1;
  }
  return book;
}

export async function getDelta(market: string) {
  if (!subscriberList.has(market) || subscriberList.get(market)!.length == 0) {
    return;
  }
  if (subscribedMarket.has(market)) {
    return;
  }
  subscribedMarket.add(market);
  await subscriber_to_orderBook_for_frontEnd.subscribe(market, (message) => {
    const users = subscriberList.get(market);
    users!.forEach((u) => {
      if (u.readyState === u.OPEN) {
        u.send(message);
      }
    });
  });
}

import { WebSocketServer } from "ws";
import {
  addUserToSubscribersList,
  connectToClient,
  getDelta,
  getFreshBook,
  removeUserFromSubscibersList,
} from "./utils/connectToClient";
import type { wsRequest } from "./types/typesForRequest";

const wss = new WebSocketServer({ port: 8080 });

await connectToClient();

wss.on("connection", (socket) => {
  socket.on("error", () => {
    console.log("There is error while connecting");
  });
  let parsedRequestForDeletion: wsRequest;
  //   socket.send("hello user, you are connected to the server");

  try {
    socket.on("message", async (data) => {
      const parsedRequest: wsRequest = JSON.parse(data.toString());
      parsedRequestForDeletion = parsedRequest;
      if (parsedRequest.type === "subscribe") {
        addUserToSubscribersList(parsedRequest.payload.market, socket);
        const fbook = await getFreshBook(parsedRequest.payload.market);
        if (!fbook) {
          socket.send("error while fetching the fresh book");
        }
        socket.send(fbook!);
        await getDelta(parsedRequest.payload.market);
      }
    });
  } catch (e) {
    console.log("error in socket", e);
  }

  socket.on("close", () => {
    if (parsedRequestForDeletion) {
      removeUserFromSubscibersList(
        parsedRequestForDeletion.payload.market,
        socket,
      );
    }
    console.log("User disconnedted");
  });
});

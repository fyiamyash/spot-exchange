import { appRouter } from "./router";
import cors from "cors";
import {
  connectToClients,
  listeningToEngineRespone,
} from "./utils/engine-client";
import { envCustom } from "./utils/envCustom";
const port = envCustom.port;
import express from "express";

const app = express();
app.use(cors());

await connectToClients();
listeningToEngineRespone();

app.use(express.json());
app.use(appRouter);

app.listen(process.env.PORT, () => {
  console.log(`This app is listening on port ${port}`);
});

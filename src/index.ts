import express from "express";
import "dotenv/config";
import env from "./config/env";
import morgan from "morgan";
import routes from "./routes";
import { Context } from "./utils";
import { LogManager } from "./utils/logger";

export const app = express();
const logger = LogManager.getInstance().get(Context.SERVER);

app.use(express.json());
app.use(morgan("combined"));
app.use("/api", routes);

const port = env.port || 3000;
// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.listen(port, async () => {
    logger.info(`Server running on port ${port}`);
});

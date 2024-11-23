import express, {static as stat, Request, Response} from "express";
import { statuses } from "./config/statuses";
import env from "./config/env";
import routes from "./route";
import { Context, errorResponse } from "./utils";
import { LogManager } from "./utils/logger";

export const app = express();
const logger = LogManager.getInstance().get(Context.SERVER);

app.use(express.json());
app.use("/api", routes);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Node.js + TypeScript API!");
});

const port = env.port || 3000;
// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.listen(port, async () => {
    logger.info(`Server running on port ${port}`);
});

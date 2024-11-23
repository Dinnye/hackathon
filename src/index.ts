import express, {static as stat, Request, Response} from "express";
import { statuses } from "./config/statuses";
import env from "./config/env";
import routes from "./route";
import { Context, errorResponse } from "./utils";
import { LogManager } from "./utils/logger";
import { IfcService } from "./services/ifc";

export const app = express();
const logger = LogManager.getInstance().get(Context.SERVER);

app.use(express.json());
app.use("/api", routes);

/*
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Node.js + TypeScript API!");
});
*/

app.get("/", (req: Request, res: Response) => {
    const dir = {
        x: 0,
        y: 0,
        z: -1,
      };
      const result = IfcService.callAllplanApi(dir, 488791.67389316217);
    console.log(result);
});

const port = env.port || 3000;
// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.listen(port, async () => {
    logger.info(`Server running on port ${port}`);
});

import { Response, Request } from "express";
import { statuses } from "../config/statuses";
import { LogManager } from "../utils/logger";
import {
  Context,
  errorResponse,
  ResponseBuilder,
  getErrorMessage,
} from "../utils";

const logger = LogManager.getInstance().get(Context.IFC);

export class IfcController {

  public static async getIfc(
      request: Request,
      response: Response,
    ): Promise<any> {
      logger.info("Getting costs");

      try {
        //TODO

        return new ResponseBuilder<string>()
        .setData("Malacka")
        .setResponse(response)
        .setResponseStatus(statuses.success)
        .build();

        return errorResponse(response, statuses.server_error, [{
          name: "Get costs error",
          message: "Internal server error"} as Error,
        ]);
      } catch (error) {
        logger.error(`CostsController getCosts: ${getErrorMessage(error)}`);
        return errorResponse(response, statuses.server_error, [error as Error]);
      }
    }
}

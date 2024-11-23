import { Response, Request } from "express";
import { statuses } from "../config/statuses";
import { LogManager } from "../utils/logger";
import {
  Context,
  errorResponse,
  ResponseBuilder,
  getErrorMessage,
} from "../utils";
import { IfcService } from "../services/ifc";

const logger = LogManager.getInstance().get(Context.IFC);

export class IfcController {

  public static async getIfc(
      request: Request,
      response: Response,
    ): Promise<any> {
      logger.info("Hallo");

      try {
        //TODO
        const dir = {
          x: 0,
          y: 0,
          z: -1,
        };
        const res = await IfcService.callAllplanApi(dir, 488791.67389316217);

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
        logger.error(`IfcController getIfc: ${getErrorMessage(error)}`);
        return errorResponse(response, statuses.server_error, [error as Error]);
      }
    }
}

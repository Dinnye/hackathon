import { Router } from "express";
import { validateSchema } from "../../middlewares/request";
import {
  ifcTestSchema,
} from "../../schemes/ifc";

import { IfcController } from "../../controllers/ifc.controller";

const router = Router();

router
  //.get("/",   [validateSchema(ifcTestSchema)],      IfcController.getIfc);
  .get("/hhh",   IfcController.getIfc);

export default router;

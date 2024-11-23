import { Router } from "express";
import { IfcController } from "../../controllers/ifc.controller";

const router = Router();

router
  .get("/",   [],      IfcController.getIfc);

export default router;

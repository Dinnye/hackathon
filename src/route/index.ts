import { Router } from "express";
import ifc from "./v1/ifc";

const router = Router();

router.use("/v1", ifc);

export default router;

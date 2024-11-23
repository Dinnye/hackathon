import { Router } from "express";
import ifc from "./v1/ifc";

const router = Router();

router.use("/ifc", ifc);

export default router;

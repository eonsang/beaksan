import express from "express";
import { index } from "../../controllers/client/index.controller";

const router = express.Router();

router.get("/", index.get);

export default router;

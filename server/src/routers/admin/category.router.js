import express from "express";

import {
  index,
  create,
  child,
} from "../../controllers/admin/category.controller";

const router = express.Router();

router.get("/", index);
router.get("/child", child);

router.route("/create").get(create.get).post(create.post);

export default router;

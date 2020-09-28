import express from "express";
import {
  index,
  orderDetail,
  orderList,
  product,
} from "../../controllers/client/index.controller";
import { isLoggedIn } from "../../middlewares/auth";

const router = express.Router();

router.get("/", isLoggedIn, index.get);

router.get("/product/:id", isLoggedIn, product.get);

export default router;

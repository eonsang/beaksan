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

router.get("/showImage", isLoggedIn, (req, res, next) => {
  const { path } = req.query;
  return res.render("showImage", {
    path,
  });
});

export default router;

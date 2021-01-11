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


router.get('/private', (req, res, next) => {
  return res.render("private");
});

router.get('/orderinfo', (req, res, next) => {
  return res.render("orderInfo");
});

router.get('/terms', (req, res, next) => {
  return res.render("terms");
});

export default router;

import express from "express";
import {
  order,
  detail,
  update,
  orderSendTrue,
  orderSendFalse,
} from "../../controllers/admin/order.controller";
import { isLoggedIn } from "../../middlewares/auth";
import multer from "multer";
import path from "path";
import {
  orderDetail,
  orderList,
} from "../../controllers/client/index.controller";

const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      return done(null, `uploads`);
    },
    filename(req, file, done) {
      const extname = path.extname(file.originalname);
      return done(
        null,
        path.basename(file.originalname, extname) + Date.now() + extname
      );
    },
  }),
});

router.get("/", isLoggedIn, order.get);
router.post("/", isLoggedIn, upload.none(), order.post);

router.post("/send_true/:id", isLoggedIn, orderSendTrue);
router.post("/send_false/:id", isLoggedIn, orderSendFalse);

router.get("/detail/:id", isLoggedIn, detail);
router.post("/detail/:id", isLoggedIn, update);

export default router;

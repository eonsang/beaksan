import {
  Cart,
  Order,
  Payment,
  Product,
  ProductOption,
  ProductOptionDetail,
} from "../../db/models";
import OrderService from "../../services/Order.service";
import CartService from "../../services/Cart.service";
import ProductService from "../../services/Product.service";

import routes from "../../routers/routes";
import logger from "../../loader/winston";
import { sendTalk } from "../../utils/kakaoMessage";

const CartInstance = new CartService(Cart);
const OrderInstance = new OrderService(Order);
const ProductInstance = new ProductService(Product);

require("dotenv").config();

export const order = {
  get: async (req, res, next) => {
    const objects = await OrderInstance.findAll({
      where: {
        UserId: req.user.id,
      },
      include: [
        {
          model: Cart,
          include: [
            {
              model: Product,
            },
          ],
        },
      ],
    });

    return res.render("order", {
      objects,
    });
  },
  post: async (req, res, next) => {
    try {
      const dto = req.body;
      const checkedItems = JSON.parse(dto.checkedItem);
      console.log(dto);
      const object = await OrderInstance.create({
        name: dto.name,
        number: dto.number,
        zipcode: dto.zipcode,
        addr1: dto.addr1,
        addr2: dto.addr2,
        addr3: dto.addr3,
        UserId: req.user.id,
        PaymentId: dto.PaymentId,
        total_price: dto.total_price,
        paid_price: dto.paid_price,
        balance_price: dto.balance_price,
      });

      checkedItems.map(async (data) => {
        const cartbox = await CartInstance.findByPk(data, {
          include: [
            {
              model: Product,
            },
          ],
        });

        await ProductInstance.update(cartbox.Product.id, {
          sold_count:
            parseInt(cartbox.Product.sold_count, 10) +
            parseInt(cartbox.quantity, 10),
        });

        await CartInstance.update(data, {
          OrderId: object.id,
        });

        console.log(cartbox);
      });

      const product = await CartInstance.findByPk(checkedItems[0], {
        include: [
          {
            model: Product,
          },
        ],
      });

      // await sendTalk(
      //   "KA01TP200928231224725fQDYrkK7bBD", // ????????? ?????????
      //   `[????????????]${req.user.name} ????????? ????????? ?????????????????????.\n????????? ?????? 2~3??? ?????? ????????????, ?????? ???????????????\n????????? ?????? ?????? ????????? ??????????????????.`, // ??????
      //   `${req.user.number}`, // ?????? ?????????
      //   [
      //     // ??????
      //     {
      //       buttonName: "????????? ????????????",
      //       buttonType: "WL",
      //       linkMo: "http://baeksanmall.com",
      //       linkPc: "http://baeksanmall.com",
      //     },
      //   ]
      // );
      // // ???)???????????????
      // await sendTalk(
      //   "KA01TP200928230940795W5RWrkEK7Vw", // ????????? ?????????
      //   `[????????????] ${req.user.name} ????????? ${product.Product.name} ?????? ??? ${checkedItems.length}?????? ?????? ??????????????????.`, // ??????
      //   `${process.env.TALK_FORM_NUMBER}` // ?????? ?????????
      // );

      return res.json({
        success: true,
        result: object,
      });
    } catch (error) {
      console.error(error);
      logger.error("?????? ?????? ??????");
      return next(error);
    }
  },
};

export const detail = async (req, res, next) => {
  try {
    const { id } = req.params;

    const object = await OrderInstance.findByPk(id, {
      include: [
        {
          model: Payment,
        },
        {
          model: Cart,
          include: [
            {
              model: Product,
            },
            {
              model: ProductOption,
            },
            {
              model: ProductOptionDetail,
            },
          ],
        },
      ],
    });

    object.Carts = object.Carts.map((obj) => {
      if (obj.lens_option) {
        obj.lens_option = JSON.parse(obj.lens_option);
        return obj;
      } else {
        return obj;
      }
    });

    let vbankDate = null;
    if (object.Payment) {
      vbankDate = new Date(object.Payment.vbank_date * 1000);
    }
    return res.render("order-detail.njk", {
      object,
      vbankDate,
    });
  } catch (error) {
    console.error(error);
    logger.error("?????? ?????? ??????");
    return next(error);
  }
};

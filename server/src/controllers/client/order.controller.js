import {
  Cart,
  Order,
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
      const object = await OrderInstance.create({
        name: dto.name,
        number: dto.number,
        zipcode: dto.zipcode,
        addr1: dto.addr1,
        addr2: dto.addr2,
        addr3: dto.addr3,
        UserId: req.user.id,
      });

      checkedItems.map(async (data) => {
        const object = await CartInstance.findByPk(data, {
          include: [
            {
              model: Product,
            },
          ],
        });

        await ProductInstance.update(object.Product.id, {
          sold_count:
            parseInt(object.Product.sold_count, 10) +
            parseInt(object.quantity, 10),
        });

        await CartInstance.update(data, {
          OrderId: object.id,
        });
      });

      const product = await CartInstance.findByPk(checkedItems[0], {
        include: [
          {
            model: Product,
          },
        ],
      });

      await sendTalk(
        "KA01TP200928231224725fQDYrkK7bBD", // 템플릿 아이디
        `[백산안경]${req.user.name} 고객님 주문이 완료되었습니다.\n영업일 기준 2~3일 정도 소요되며, 추가 문의사항은\n게시판 혹은 전화 상담을 부탁드립니다.`, // 내용
        `${req.user.number}`, // 상대 연락처
        [
          // 버튼
          {
            buttonName: "사이트 바로가기",
            buttonType: "WL",
            linkMo: "http://baeksanmall.com",
            linkPc: "http://baeksanmall.com",
          },
        ]
      );
      // 관)고객이주문
      await sendTalk(
        "KA01TP200928230940795W5RWrkEK7Vw", // 템플릿 아이디
        `[백산안경] ${req.user.name} 고객이 ${product.Product.name} 상품 외 ${checkedItems.length}건을 주문 주문했습니다.`, // 내용
        `${process.env.TALK_FORM_NUMBER}` // 상대 연락처
      );

      return res.json({
        success: true,
        result: object,
      });
    } catch (error) {
      console.error(error);
      logger.error("주문 등록 실패");
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

    return res.render("order-detail.njk", {
      object,
    });
  } catch (error) {
    console.error(error);
    logger.error("주문 조회 실패");
    return next(error);
  }
};

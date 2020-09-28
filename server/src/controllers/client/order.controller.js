import {
  Cart,
  Order,
  Product,
  ProductOption,
  ProductOptionDetail,
} from "../../db/models";
import OrderService from "../../services/Order.service";
import CartService from "../../services/Cart.service";

import routes from "../../routers/routes";
import logger from "../../loader/winston";

const CartInstance = new CartService(Cart);
const OrderInstance = new OrderService(Order);

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
        await CartInstance.update(data, {
          OrderId: object.id,
        });
      });

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

    console.log(object);

    return res.render("order-detail.njk", {
      object,
    });
  } catch (error) {
    console.error(error);
    logger.error("주문 조회 실패");
    return next(error);
  }
};

import { Op } from "sequelize";
import moment from "moment";

import {
  Product,
  ProductImage,
  ProductOption,
  ProductOptionDetail,
  Cart,
} from "../../db/models";
import ProductService from "../../services/Product.service";
import CartService from "../../services/Cart.service";

import routes from "../../routers/routes";
import logger from "../../loader/winston";

const ProductInstance = new ProductService(
  Product,
  ProductOption,
  ProductOptionDetail,
  ProductImage
);
const CartInstance = new CartService(Cart);

export const cart = {
  get: async (req, res, next) => {
    try {
      const objects = await CartInstance.findAll({
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
        where: {
          UserId: req.user.id,
          OrderId: null,
        },
      });

      return res.render("cart", {
        objects,
        user: req.user,
      });
    } catch (error) {
      logger.error("가져오기 에러");
      return next(error);
    }
  },
  post: (req, res, next) => {
    return res.render("cart");
  },
};

export const all = async (req, res, next) => {
  try {
    const objects = await CartInstance.findAll({
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
      where: {
        UserId: req.user.id,
        OrderId: null,
      },
    });
    console.log(objects);
    return res.json({
      success: true,
      data: objects,
    });
  } catch (error) {
    logger.error("가져오기 에러");
    return next(error);
  }
};

export const add = async (req, res, next) => {
  try {
    console.log(req.body);
    const object = await CartInstance.create({
      UserId: req.user.id,
      ProductId: req.body.productId,
      ProductOptionId: req.body.optionId,
      ProductOptionDetailId: req.body.optionDetailId,
      quantity: 1,
    });
    return res.json({
      success: true,
      data: object,
    });
  } catch (error) {
    console.error(error);
    logger.error("추가하기 에러");
    return next(error);
  }
};

export const quantityChange = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    console.log(quantity);
    await CartInstance.update(id, {
      quantity,
    });
    return res.json({
      success: true,
    });
  } catch (error) {
    console.error(error);
    logger.error("추가하기 에러");
    return next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    await CartInstance.destroy(id);
    return res.json({
      success: true,
    });
  } catch (error) {
    console.error(error);
    logger.error("삭제하기 에러");
    return next(error);
  }
};

export const clear = async (req, res, next) => {
  try {
    const objects = await CartInstance.findAll({
      where: {
        UserId: req.user.id,
        OrderId: null,
      },
    });
    objects.map(async (object) => {
      await CartInstance.destroy(object.id);
    });
    return res.json({
      success: true,
    });
  } catch (error) {
    console.error(error);
    logger.error("삭제하기 에러");
    return next(error);
  }
};

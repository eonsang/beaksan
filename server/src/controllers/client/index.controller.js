import { Op } from "sequelize";
import moment from "moment";

import {
  Category,
  LensDiaOption,
  Popup,
  PopupImage,
  Product,
  ProductImage,
  ProductOption,
  ProductOptionDetail,
} from "../../db/models";
import PopupService from "../../services/Popup.service";
import CategoryService from "../../services/Category.service";
import ProductService from "../../services/Product.service";

import routes from "../../routers/routes";
import logger from "../../loader/winston";

const PopupServiceInstance = new PopupService(Popup);
const CategoryInstance = new CategoryService(Category);
const ProductInstance = new ProductService(
  Product,
  ProductOption,
  ProductOptionDetail,
  ProductImage,
  LensDiaOption
);

function prevDay(days) {
  var d = new Date();
  var dayOfMonth = d.getDate();
  d.setDate(dayOfMonth - days);
  return d;
}

export const index = {
  get: async (req, res, next) => {
    try {
      const popups = await PopupServiceInstance.findAll({
        where: {
          is_active: true,
          start_date: {
            [Op.lte]: moment().locale("ko").toDate(),
          },
          end_date: {
            [Op.gte]: moment().locale("ko").toDate(),
          },
        },
        include: [PopupImage],
      });

      const { depth } = req.query;

      let products = null;
      let categories = null;
      if (depth) {
        products = await ProductInstance.findAll({
          where: {
            use: true,
          },
          include: [
            {
              model: ProductImage,
            },
            {
              model: Category,
              where: {
                id: depth,
              },
            },
          ],
        });
        categories = await CategoryInstance.findAll({
          order: [["order", "DESC"]],
          where: {
            CategoryId: depth,
          },
          include: [
            {
              model: Category,
              as: "children",
            },
          ],
        });
      } else {
        products = await ProductInstance.findAll({
          where: {
            use: true,
          },
          include: [
            {
              model: ProductImage,
            },
            {
              model: Category,
            },
          ],
        });
      }

      return res.render("index", {
        message: req.flash("message"),
        popups,
        products,
        categories,
        depth,
        today: prevDay(7),
      });
    } catch (error) {
      logger.error("메인 로딩 실패");
      return next(error);
    }
  },
};

export const product = {
  get: async (req, res, next) => {
    try {
      const { id } = req.params;
      const product = await ProductInstance.findByPk(id, {
        order: [
          [ProductOption, "createdAt", "ASC"],
          [ProductOption, ProductOptionDetail, "order", "ASC"],
        ],
        include: [
          {
            model: Category,
          },
          {
            model: ProductOption,
            include: [
              {
                model: ProductOptionDetail,
                include: [
                  {
                    model: LensDiaOption,
                  },
                ],
              },
            ],
          },
          {
            model: ProductImage,
          },
        ],
      });
      return res.json({
        success: true,
        product,
      });
    } catch (error) {
      logger.error("상품상세 가져오기 실패");
      return next(error);
    }
  },
};

import {
  Cart,
  Order,
  Product,
  ProductImage,
  ProductOption,
  ProductOptionDetail,
  Qna,
  User,
} from "../../db/models";
import AccountsService from "../../services/Accounts.service";
import routes from "../../routers/routes";
import OrderService from "../../services/Order.service";
import ProductService from "../../services/Product.service";
import QnaService from "../../services/Qna.service";

const AccountsInstance = new AccountsService(User);
const OrderInstance = new OrderService(Order);
const ProductInstance = new ProductService(
  Product,
  ProductOption,
  ProductOptionDetail,
  ProductImage
);
const QnaServiceInstance = new QnaService(Qna);

export const dashboard = async (req, res) => {
  const userCount = await AccountsInstance.getAllCount();
  const users = await AccountsInstance.findAll();
  const productCount = await ProductInstance.getAllCount();
  const qnaCount = await QnaServiceInstance.getAllCount();
  const orders = await OrderInstance.findAll({
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
  res.render("admin/index", {
    userCount,
    orders,
    productCount,
    qnaCount,
    users,
  });
};

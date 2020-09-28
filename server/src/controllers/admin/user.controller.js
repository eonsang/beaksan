import {
  User,
  Qna,
  Order,
  Cart,
  Product,
  ProductOption,
  ProductOptionDetail,
} from "../../db/models";
import AccountsService from "../../services/Accounts.service";
import logger from "../../loader/winston";
import bcrypt from "bcrypt";
import createKey from "../../utils/createKey";

const AccountsServiceInstance = new AccountsService(User);

export const detail = {
  get: async (req, res, next) => {
    const { id } = req.params;
    const user = await AccountsServiceInstance.findByPk(id, {
      include: [
        {
          model: Qna,
        },
        {
          model: Order,
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
        },
      ],
    });

    console.log("user", user);
    return res.render("admin/user_detail", {
      user,
      message: req.flash("message"),
    });
  },
  post: async (req, res, next) => {
    const { id, nickname, role, number, password } = req.body;
    let data = {
      nickname,
      number,
      role,
    };
    if (password !== "") {
      const hash = await bcrypt.hash(password, 12);
      data = {
        ...data,
        password: hash,
      };
    }

    const result = await AccountsServiceInstance.update(id, data);
    if (result) {
      req.flash("message", "회원정보가 수정 되었습니다.");
      return res.redirect(`/adm/user/${id}`);
    }
  },
};

import { Op } from "sequelize";
import moment from "moment";

import { Popup, PopupImage } from "../../db/models";
import PopupService from "../../services/Popup.service";
import routes from "../../routers/routes";
import logger from "../../loader/winston";

const PopupServiceInstance = new PopupService(Popup);

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

      console.log(popups);

      return res.render("index", {
        message: req.flash("message"),
        popups,
      });
    } catch (error) {
      logger.error("메인 로딩 실패");
      return next(error);
    }
  },
};

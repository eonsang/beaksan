import { Qna, User } from "../../db/models";
import QnaService from "../../services/Qna.service";
import AccountsService from "../../services/Accounts.service";
import logger from "../../loader/winston";

const QnaServiceInstance = new QnaService(Qna);
const AccountsServiceInstance = new AccountsService(User);

export const index = {
  get: async (req, res, next) => {
    try {
      const objects = await QnaServiceInstance.findAll({
        order: [["id", "DESC"]],
        include: [
          {
            model: User,
          },
        ],
      });

      return res.render("qna_list", {
        objects,
      });
    } catch (error) {
      logger.error("메인 로딩 실패");
      return next(error);
    }
  },
};

export const detail = {
  get: async (req, res, next) => {
    try {
      const { id } = req.params;
      const object = await QnaServiceInstance.findByPk(id, {
        include: [
          {
            model: User,
          },
        ],
      });

      // 비밀글
      if (object.is_secret && object.User.id !== (req.user && req.user.id)) {
        req.flash("message", "비밀글 입니다.");
        return res.redirect("/qna");
      }
      const answer = await AccountsServiceInstance.findByPk(object.reply_user);

      return res.render("qna_detail", {
        object,
        answer,
      });
    } catch (error) {
      logger.error("메인 로딩 실패");
      return next(error);
    }
  },
};

export const update = {
  get: async (req, res, next) => {
    try {
      const { id } = req.params;
      const object = await QnaServiceInstance.findByPk(id, {
        include: [
          {
            model: User,
          },
        ],
      });
      if (object.is_secret && object.User.id !== (req.user && req.user.id)) {
        return res.redirect("/qna");
      }
      return res.render("qna_create", {
        object,
      });
    } catch (error) {
      logger.error("업데이트 화면 불러오기 실패");
      return next(error);
    }
  },
  post: async (req, res, next) => {
    try {
      const { id } = req.params;
      let dto = req.body;
      dto = {
        ...dto,
        is_secret: dto.is_secret === "on",
        receive_email: dto.receive_email === "on",
        receive_sms: dto.receive_sms === "on",
        receive_talk: dto.receive_talk === "on",
      };
      const object = await QnaServiceInstance.update(id, dto);
      if (object.is_secret && object.User.id !== (req.user && req.user.id)) {
        return res.redirect("/qna");
      }
      return res.redirect(`/qna/detail/${id}`);
    } catch (error) {
      logger.error("업데이트 화면 불러오기 실패");
      return next(error);
    }
  },
};

export const create = {
  get: async (req, res, next) => {
    try {
      return res.render("qna_create");
    } catch (error) {
      logger.error("업데이트 화면 불러오기 실패");
      return next(error);
    }
  },
  post: async (req, res, next) => {
    try {
      let dto = req.body;
      console.log(req.user);
      dto = {
        ...dto,
        is_secret: dto.is_secret === "on",
        receive_email: dto.receive_email === "on",
        receive_sms: dto.receive_sms === "on",
        receive_talk: dto.receive_talk === "on",
        created_ip: req.ipInfo.ip,
        UserId: req.user.id,
      };
      const object = await QnaServiceInstance.create(dto);
      return res.redirect(`/qna/detail/${object.id}`);
    } catch (error) {
      logger.error("생성 후 상세 화면 불러오기 실패");
      return next(error);
    }
  },
};

export const remove = {
  post: async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await QnaServiceInstance.destroy(id);
      if (result) {
      } else {
      }
      return res.redirect("/qna");
    } catch (error) {
      logger.error("qna 삭제 실패");
      return next(error);
    }
  },
};

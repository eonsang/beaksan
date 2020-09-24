import { Setting } from "../db/models";
import SettingsService from "../services/Settings.service";
import routes from "../routers/routes";
import logger from "../loader/winston";

const SettingsInstance = new SettingsService(Setting);

const localsMiddleware = async (req, res, next) => {
  res.locals.defaultInfo = await SettingsInstance.findByPk(1);
  res.locals.siteName = "오늘기록";
  res.locals.routes = routes;
  next();
};

export default localsMiddleware;

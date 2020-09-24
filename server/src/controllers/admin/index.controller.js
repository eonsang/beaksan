import { User } from "../../db/models";
import AccountsService from "../../services/Accounts.service";
import routes from "../../routers/routes";

const AccountsServiceInstance = new AccountsService(User);

export const dashboard = async (req, res) => {
  const userCount = await AccountsServiceInstance.getAllCount();
  res.render("admin/index", {
    userCount,
  });
};

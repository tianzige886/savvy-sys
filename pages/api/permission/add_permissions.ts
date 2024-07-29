import { authMiddleware } from "../../lib/middleware";
import { models, sequelize } from "../../config/db";
const { UserButtonPermission, UserMenuPermission } = models;
const { Op } = require("sequelize");

export default authMiddleware(async (req: any, res: any) => {
  try {
    const { data } = req.body;
    const params = JSON.parse(data);

    const userId = params.userId;
    const permissions = params.permissions;

    if (permissions.length === 0 || !userId) {
      res
        .status(200)
        .json({ data: { data: null, code: 400, message: "参数错误" } });
    }

    const userPermissions = await UserButtonPermission.findAll({
      where: { user_id: userId },
    });
    if (userPermissions.length > 0) {
      await UserButtonPermission.destroy({
        where: { user_id: userId },
      });
      await UserMenuPermission.destroy({
        where: { user_id: userId },
      });
    }

    let menus = [];
    let buttons = [];
    for (let i = 0; i < permissions.length; i++) {
      const menu = permissions[i];
      menus.push({ menu_id: menu.id, user_id: userId });
      if (menu.buttons.length > 0) {
        for (let j = 0; j < menu.buttons.length; j++) {
          const btn = menu.buttons[j];
          buttons.push({ button_id: btn, user_id: userId, menu_id: menu.id });
        }
      }
    }

    if (menus.length > 0) {
      await UserMenuPermission.bulkCreate(menus);
    }
    if (buttons.length > 0) {
      await UserButtonPermission.bulkCreate(buttons);
    }

    res.status(200).json({ data: { data: null, code: 0, message: "ok" } });

    // res.status(500).json({ error });
  } catch (error) {
    res.status(500).json({ error });
  }
});

import { authMiddleware } from "../../lib/middleware";
import { models } from "../../config/db";
const { UserMenuPermission, UserButtonPermission, Menu, Button } = models;
const { Op } = require("sequelize");

export default authMiddleware(async (req: any, res: any) => {
  try {
    const { userId } = req.body;

    const permits = await UserButtonPermission.findAll({
      where: { user_id: userId },
    });
    let menuIds = [];
    if (permits.length > 0) {
      for (let i = 0; i < permits.length; i++) {
        const permit = permits[i];
        menuIds.push(permit.menu_id);
      }
    }
    menuIds = [...new Set(menuIds)];
    let menu_list = [];
    if (menuIds.length > 0) {
      const menuList = await Menu.findAll({
        where: { id: { [Op.in]: menuIds } },
      });
      if (menuList.length > 0) {
        for (let i = 0; i < menuList.length; i++) {
          const item: any = menuList[i];
          const permit = permits.filter((p) => p.menu_id === item.id);
          const menuBtnIds = permit.map((p) => p.button_id);
          const buttonList = await Button.findAll({
            where: { id: { [Op.in]: menuBtnIds } },
          });
          const btn_list = [...buttonList];
          item.dataValues.buttons = btn_list;
          menu_list.push(item);
        }
      }
    }

    res.status(200).json({ data: { list: menu_list, code: 0 } });
  } catch (error) {
    console.log("error----------------");
    console.log(error);
    res.status(500).json({ error });
  }
});

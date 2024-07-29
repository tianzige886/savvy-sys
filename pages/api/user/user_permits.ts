import { authMiddleware } from "../../lib/middleware";
import { models } from "../../config/db";
const { UserMenuPermission, UserButtonPermission, Menu, Button } = models;
const { Op } = require("sequelize");

export default authMiddleware(async (req: any, res: any) => {
  try {
    const { userId } = req.body;

    const permits: any = await UserButtonPermission.findAll({
      where: { user_id: userId },
    });
    let menuIds: any[] = [];
    if (permits.length > 0) {
      for (let i = 0; i < permits.length; i++) {
        const permit: any = permits[i];
        menuIds.push(permit.menu_id);
      }
    }
    menuIds = [...new Set(menuIds)];
    let menu_list: any[] = [];
    if (menuIds.length > 0) {
      const menuList: any = await Menu.findAll({
        where: { id: { [Op.in]: menuIds } },
      });
      if (menuList.length > 0) {
        for (let i = 0; i < menuList.length; i++) {
          const item: any = menuList[i];
          const permit: any[] = permits.filter(
            (p: any) => p.menu_id === item.id
          );
          const menuBtnIds: any[] = permit.map((p) => p.button_id);
          const buttonList: any = await Button.findAll({
            where: { id: { [Op.in]: menuBtnIds } },
          });
          const btn_list: any[] = [...buttonList];
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

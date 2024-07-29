const { authMiddleware } = require("../../lib/middleware");
import { models } from "../../config/db";
const { Button, Menu } = models;
const { Op } = require("sequelize");

export default authMiddleware(async (req: any, res: any) => {
  try {
    const menus = await Menu.findAll({ order: [["id", "DESC"]] });
    for (let i = 0; i < menus.length; i++) {
      const menuItem = menus[i] || "";
      const btnIds = menuItem.button_id.split(",").map((id) => parseInt(id));
      const buttons = await Button.findAll({
        where: { id: { [Op.in]: btnIds } },
      });
      menus[i].dataValues.buttons = buttons;
    }
    res.status(200).json({ data: { list: menus, code: 0 } });
  } catch (error) {
    res.status(500).json({ error });
  }
});

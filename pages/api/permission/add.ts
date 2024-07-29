import { authMiddleware } from "../../lib/middleware";
import { models, sequelize } from "../../config/db";
const { Button, Menu } = models;
const { Op } = require("sequelize");

export default authMiddleware(async (req: any, res: any) => {
  try {
    const { buttons = "", name = "", path = "", label = "" } = req.body;

    const currentMenu = await Menu.findAll({ where: { name } });

    if (currentMenu.length > 0) {
      await Menu.destroy({ where: { name } });
    }
    await Menu.create({
      name: name,
      path: path,
      label: label,
      button_id: buttons,
    });

    res.status(200).json({ data: { data: null, code: 0, message: "ok" } });
  } catch (error) {
    res.status(500).json({ error });
  }
});

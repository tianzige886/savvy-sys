import { authMiddleware } from "../../lib/middleware";
import { models } from "../../config/db";
const { HomeHot } = models;
const { Op } = require("sequelize");

export default authMiddleware(async (req: any, res: any) => {
  try {
    const id = Number(req?.body?.id);
    const homeHot: any = await HomeHot.findByPk(id);
    await homeHot.destroy();
    res.status(200).json({ code: 0, message: "success", data: null });
  } catch (error) {
    res.status(500).json({ error });
  }
});

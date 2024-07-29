import { authMiddleware } from "../../lib/middleware";
import { models } from "../../config/db";
const { WeekRecommend } = models;
const { Op } = require("sequelize");

export default authMiddleware(async (req: any, res: any) => {
  try {
    const id = Number(req?.body?.id);
    const weekRecommend: any = await WeekRecommend.findByPk(id);
    await weekRecommend.destroy();
    res.status(200).json({ code: 0, message: "success", data: null });
  } catch (error) {
    res.status(500).json({ error });
  }
});

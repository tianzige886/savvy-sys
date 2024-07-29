import { authMiddleware } from "../../lib/middleware";
import { models } from "../../config/db";
const { HomeRecommend } = models;
const { Op } = require("sequelize");

export default authMiddleware(async (req, res) => {
  try {
    const id = Number(req?.body?.id);
    const homeRecommend: any = await HomeRecommend.findByPk(id);
    await homeRecommend.destroy();
    res.status(200).json({ code: 0, message: "success", data: null });
  } catch (error) {
    res.status(500).json({ error });
  }
});

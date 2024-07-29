import { authMiddleware } from "../../lib/middleware";
import { models } from "../../config/db";
const { HomeRecommend } = models;
const { Op } = require("sequelize");

export default authMiddleware(async (req: any, res: any) => {
  try {
    const { id = "", review_status = "" } = req.body;
    const user: any = await HomeRecommend.findByPk(id);
    await user.update({ review_status });
    res.status(200).json({ data: { message: "ok", code: 0 } });
  } catch (error) {
    res.status(500).json({ error });
  }
});

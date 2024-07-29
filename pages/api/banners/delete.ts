import { authMiddleware } from "../../lib/middleware";
import { models } from "../../config/db";
const { HomeBanner } = models;
const { Op } = require("sequelize");

export default authMiddleware(async (req: any, res: any) => {
  try {
    const id = Number(req?.body?.id);
    const homeBanner: any = await HomeBanner.findByPk(id);
    await homeBanner.destroy();
    res.status(200).json({ code: 0, message: "success", data: null });
  } catch (error) {
    res.status(500).json({ error });
  }
});

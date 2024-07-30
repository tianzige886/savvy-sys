import { authMiddleware } from "../../lib/middleware";
import { models } from "../../config/db";
const { WeekRecommend } = models;
const { Op } = require("sequelize");

export default authMiddleware(async (req: any, res: any) => {
  const id = Number(req?.body?.id);

  try {
    // @ts-ignore
    await WeekRecommend.update({ is_set_home: 0 }, { where: {} });
    // @ts-ignore
    await WeekRecommend.update({ is_set_home: 1 }, { where: { id } });
    res.status(200).json({ data: null, code: 0, message: "success" });
  } catch (error) {
    console.log("error----------------");
    console.log(error);
    res.status(500).json({ error });
  }
});

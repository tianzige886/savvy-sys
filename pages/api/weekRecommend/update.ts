import { authMiddleware } from "../../lib/middleware";
import { models } from "../../config/db";
const { WeekRecommend } = models;
const { Op } = require("sequelize");

export default authMiddleware(async (req: any, res: any) => {
  const { sequence, game_id, id, cover_url } = req.body;

  try {
    // @ts-ignore
    const weekRecommend = await WeekRecommend.findOne({ where: { id: id } });
    if (weekRecommend) {
      // @ts-ignore
      await weekRecommend.update({
        sequence,
        game_id,
        cover_url,
      });
      res.status(200).json({ data: null, code: 0, message: "success" });
    } else {
      res.status(500).json({ message: "no record" });
    }
  } catch (error) {
    console.log("error----------------");
    console.log(error);
    res.status(500).json({ error });
  }
});

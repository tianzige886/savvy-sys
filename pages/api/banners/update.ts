import { authMiddleware } from "../../lib/middleware";
import { models } from "../../config/db";
const { HomeBanner } = models;
const { Op } = require("sequelize");

export default authMiddleware(async (req: any, res: any) => {
  const { sequence, game_id, id } = req.body;

  try {
    // @ts-ignore
    const homeBanner = await HomeBanner.findOne({ where: { id: id } });
    if (homeBanner) {
      // @ts-ignore
      await homeBanner.update({
        sequence,
        game_id,
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

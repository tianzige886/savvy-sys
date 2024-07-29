import { authMiddleware } from "../../lib/middleware";
import { models } from "../../config/db";
const { WeekRecommend } = models;
const { Op } = require("sequelize");

export default authMiddleware(async (req, res) => {
  const { sequence, game_ids, cover_url } = req.body;

  try {
    // @ts-ignore
    await WeekRecommend.create({
      sequence,
      game_ids,
      cover_url,
    });
    res.status(200).json({ data: null, code: 0, message: "success" });
  } catch (error) {
    console.log("error----------------");
    console.log(error);
    res.status(500).json({ error });
  }
});

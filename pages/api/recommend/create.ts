import { authMiddleware } from "../../lib/middleware";
import { models } from "../../config/db";
const { HomeRecommend } = models;
const { Op } = require("sequelize");

export default authMiddleware(async (req, res) => {
  const { sequence, game_id } = req.body;

  try {
    // @ts-ignore
    await HomeRecommend.create({
      sequence,
      game_id,
    });
    res.status(200).json({ data: null, code: 0, message: "success" });
  } catch (error) {
    console.log("error----------------");
    console.log(error);
    res.status(500).json({ error });
  }
});

import { authMiddleware } from "../../lib/middleware";
import { models } from "../../config/db";
const { HomeHot } = models;
const { Op } = require("sequelize");

export default authMiddleware(async (req, res) => {
  const { sequence, game_id } = req.body;

  try {
    // @ts-ignore
    await HomeHot.create({
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

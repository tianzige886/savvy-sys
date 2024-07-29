import { authMiddleware } from "../../lib/middleware";
import { models } from "../../config/db";
const { Game } = models;
const { Op } = require("sequelize");

export default authMiddleware(async (req: any, res: any) => {
  try {
    const { ids = "" } = req.query;
    if (!ids) {
      return;
    }
    const idddds = ids.split(",").map((item: any) => {
      return parseInt(item, 10);
    });

    const game = await Game.findAll({
      id: ids.split(",").map((item) => {
        return parseInt(item, 10);
      }),
      order: [["updated_at", "DESC"]],
    });
    res.status(200).json({
      data: game,
      code: 0,
      message: "success",
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

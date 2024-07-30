import { authMiddleware } from "../../lib/middleware";
import { models } from "../../config/db";
const { Game } = models;
const { Op } = require("sequelize");

export default authMiddleware(async (req: any, res: any) => {
  try {
    const { ids = "", review_status } = req.query;
    if (!ids) {
      return;
    }

    const where = {
      id: {
        [Op.in]: ids.split(",").map((item: string) => {
          return parseInt(item, 10);
        }),
      },
    };

    if (review_status) {
      // @ts-ignore
      where.review_status = review_status;
    }

    // @ts-ignore
    const game = await Game.findAll({
      where,
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

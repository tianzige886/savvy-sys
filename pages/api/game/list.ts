import { authMiddleware } from "../../lib/middleware";
import { models } from "../../config/db";
const { Game } = models;
const { Op } = require("sequelize");

export default authMiddleware(async (req: any, res: any) => {
  try {
    const { keyword, review_status } = req.query;
    const pageNumber = parseInt(req?.query?.pageNumber) ?? 1;
    const pageSize = parseInt(req?.query?.pageSize) ?? 20;
    const where: any = {};
    if (keyword) {
      where.name = { [Op.like]: `%${keyword}%` };
    }
    // review_status: 1 待审核, 2 审核中，3 已上架， 4 审核失败， 5 已下架
    if (review_status) {
      where.review_status = review_status;
    }
    // 获取总记录数
    const totalCount = await Game.count({ where });
    const offset = (pageNumber - 1) * pageSize;
    const game = await Game.findAll({
      where,
      limit: pageSize,
      offset: offset,
      order: [["created_at", "DESC"]],
    });
    res.status(200).json({
      data: {
        totalCount,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalCount / pageSize),
        list: game,
      },
      code: 0,
      message: "success",
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

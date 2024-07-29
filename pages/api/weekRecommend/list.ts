import { authMiddleware } from "../../lib/middleware";
import { models, sequelize } from "../../config/db";
const { WeekRecommend } = models;

export default authMiddleware(async (req: any, res: any) => {
  const { review_status } = req.query;
  const where: any = {};
  if (review_status) {
    where.review_status = review_status;
  }
  try {
    // @ts-ignore
    const weekRecommends = await WeekRecommend.findAll({
      where,
      order: [["updated_at", "DESC"]],
    });
    res.status(200).json({ data: weekRecommends, message: "success", code: 0 });
  } catch (error) {
    res.status(500).json({ error });
  }
});

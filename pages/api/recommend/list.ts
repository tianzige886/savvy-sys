import { authMiddleware } from "../../lib/middleware";
import { models, sequelize } from "../../config/db";
import { QueryTypes } from "sequelize";

export default authMiddleware(async (req, res) => {
  const { review_status } = req.query;
  let query = "";
  if (review_status) {
    query = `
      SELECT 
        hr.id, hr.sequence, hr.review_status,
        hr.created_at, hr.updated_at,
        g.id AS game_id, g.name, g.cover_url,
        g.created_at AS game_created_at, g.updated_at AS game_updated_at
      FROM home_recommend hr
      LEFT JOIN game g ON hr.game_id = g.id  WHERE hr.review_status = ${Number(
        review_status
      )}
      ORDER BY hr.updated_at DESC
    `;
  } else {
    query = `
      SELECT 
        hr.id, hr.sequence, hr.review_status,
        hr.created_at, hr.updated_at,
        g.id AS game_id, g.name, g.cover_url,
        g.created_at AS game_created_at, g.updated_at AS game_updated_at
      FROM home_recommend hr
      LEFT JOIN game g ON hr.game_id = g.id
      ORDER BY hr.updated_at DESC
    `;
  }

  try {
    // @ts-ignore
    const homeRecommendWithGames = await sequelize.query(query, {
      type: QueryTypes?.SELECT,
    });
    res
      .status(200)
      .json({ data: homeRecommendWithGames, message: "success", code: 0 });
  } catch (error) {
    res.status(500).json({ error });
  }
});

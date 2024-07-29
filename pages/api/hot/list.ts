import { authMiddleware } from "../../lib/middleware";
import { models, sequelize } from "../../config/db";
import { QueryTypes } from "sequelize";

export default authMiddleware(async (req: any, res: any) => {
  const { review_status } = req.query;
  let query = "";
  if (review_status) {
    query = `
      SELECT 
        hh.id, hh.sequence, hh.review_status,
        hh.created_at, hh.updated_at,
        g.id AS game_id, g.name, g.cover_url,
        g.created_at AS game_created_at, g.updated_at AS game_updated_at
      FROM home_hot hh
      LEFT JOIN game g ON hh.game_id = g.id  WHERE hh.review_status = ${Number(
        review_status
      )}
      ORDER BY hh.updated_at DESC
    `;
  } else {
    query = `
      SELECT 
        hh.id, hh.sequence, hh.review_status,
        hh.created_at, hh.updated_at,
        g.id AS game_id, g.name, g.cover_url,
        g.created_at AS game_created_at, g.updated_at AS game_updated_at
      FROM home_hot hh
      LEFT JOIN game g ON hh.game_id = g.id
      ORDER BY hh.updated_at DESC
    `;
  }

  try {
    // @ts-ignore
    const homeHotWithGames = await sequelize.query(query, {
      type: QueryTypes?.SELECT,
    });
    res
      .status(200)
      .json({ data: homeHotWithGames, message: "success", code: 0 });
  } catch (error) {
    res.status(500).json({ error });
  }
});

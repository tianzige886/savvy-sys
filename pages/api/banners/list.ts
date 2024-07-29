import { authMiddleware } from "../../lib/middleware";
import { models, sequelize } from "../../config/db";
import { Sequelize, QueryTypes } from "sequelize";
// const { HomeBanner } = models;
// const { Op } = require("sequelize");

export default authMiddleware(async (req: any, res: any) => {
  const { review_status } = req?.query;

  let query = "";
  if (review_status) {
    query = `SELECT hb.id, hb.sequence, hb.created_at, hb.updated_at, g.id AS game_id, g.name, g.cover_url,hb.review_status, g.created_at AS game_created_at, g.updated_at AS game_updated_at FROM home_banner hb LEFT JOIN game g ON hb.game_id = g.id  WHERE hb.review_status = ${Number(
      review_status
    )}  ORDER BY hb.updated_at DESC`;
  } else {
    query = `SELECT hb.id, hb.sequence, hb.created_at, hb.updated_at, g.id AS game_id, g.name, g.cover_url,hb.review_status, g.created_at AS game_created_at, g.updated_at AS game_updated_at
    FROM home_banner hb 
    LEFT JOIN game g ON hb.game_id = g.id
    ORDER BY hb.updated_at DESC
`;
  }

  try {
    // const homeBanners = await HomeBanner.findAll({
    //   order: [["created_at", "DESC"]],
    // });
    // @ts-ignore
    const homeBannersWithGames = await sequelize.query(query, {
      type: QueryTypes?.SELECT,
    });
    res
      .status(200)
      .json({ data: homeBannersWithGames, message: "success", code: 0 });
  } catch (error) {
    res.status(500).json({ error });
  }
});

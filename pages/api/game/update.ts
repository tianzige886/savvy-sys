import { authMiddleware } from "../../lib/middleware";
import { models } from "../../config/db";
const { Game } = models;
const { Op } = require("sequelize");

export default authMiddleware(async (req, res) => {
  const {
    id,
    name,
    status,
    status_name,
    token,
    token_name,
    platform,
    platform_name,
    size,
    release_time,
    media,
    introduction,
    gameplay_show,
    gameplay_description,
    other_description,
    cover_url,
    logo,
    website,
    networks,
    review_status,
    pictures,
    online,
    short_introduction,
  } = req.body;

  try {
    // @ts-ignore
    const game = await Game.findOne({ where: { id: id } });
    if (game) {
      // @ts-ignore
      await game.update({
        name,
        status,
        status_name,
        token,
        token_name,
        platform,
        platform_name,
        size,
        release_time,
        media,
        introduction,
        gameplay_show,
        gameplay_description,
        other_description,
        cover_url,
        logo,
        website,
        networks,
        review_status,
        pictures,
        online,
        short_introduction,
      });
      res.status(200).json({ data: null, code: 0, message: "success" });
    } else {
      res.status(500).json({ message: "no record" });
    }
  } catch (error) {
    console.log("error----------------");
    console.log(error);
    res.status(500).json({ error });
  }
});

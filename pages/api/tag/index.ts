import { authMiddleware } from "../../lib/middleware";
import { models } from "../../config/db";
const { Tag } = models;
const { Op } = require("sequelize");

export default authMiddleware(async (req, res) => {
  try {
    const tags = await Tag.findAll({
      order: [["created_at", "DESC"]],
    });
    res.status(200).json({ list: tags, code: 0, message: "success" });
  } catch (error) {
    res.status(500).json({ error });
  }
});

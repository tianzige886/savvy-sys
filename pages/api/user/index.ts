import { authMiddleware } from "../../lib/middleware";
import { models } from "../../config/db";
const { User } = models;
const { Op } = require("sequelize");

export default authMiddleware(async (req, res) => {
  try {
    const { username = "" } = req.query;
    const where: any = {};
    if (username) {
      where.username = { [Op.like]: `%${username}%` };
    }
    const users = await User.findAll({
      where,
      order: [["created_at", "DESC"]],
    });
    res.status(200).json({ data: { list: users, code: 0 } });
  } catch (error) {
    res.status(500).json({ error });
  }
});

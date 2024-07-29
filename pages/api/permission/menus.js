const { authMiddleware } = require("../../lib/middleware");
import { models } from "../../config/db";
const { Menu } = models;
const { Op } = require("sequelize");

export default authMiddleware(async (req, res) => {
  try {
    const users = await Menu.findAll();
    res.status(200).json({ data: { list: users, code: 0 } });
  } catch (error) {
    res.status(500).json({ error });
  }
});

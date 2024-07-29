import { authMiddleware } from "../../lib/middleware";
import { models } from "../../config/db";
const { User } = models;
const { Op } = require("sequelize");

export default authMiddleware(async (req, res) => {
  try {
    const { id = "" } = req.body;
    const user: any = await User.findByPk(id);
    await user.destroy();
    res.status(200).json({ data: { message: "ok", code: 0 } });
  } catch (error) {
    res.status(500).json({ error });
  }
});

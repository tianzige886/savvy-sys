const { authMiddleware } = require("../../lib/middleware");
import { models } from "../../config/db";
const { UserButtonPermission, UserMenuPermission, Menu } = models;
const { Op } = require("sequelize");

export default authMiddleware(async (req, res) => {
  try {
    const { userId } = req.body;

    const permits = await UserButtonPermission.findAll({
      where: { user_id: userId },
    });

    res.status(200).json({ data: { list: permits, code: 0 } });
  } catch (error) {
    res.status(500).json({ error });
  }
});

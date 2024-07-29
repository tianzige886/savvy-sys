import { authMiddleware } from "../../lib/middleware";
import { models } from "../../config/db";
const { Game } = models;
const { Op } = require("sequelize");
import { FindOptions } from "sequelize";

export default authMiddleware(async (req: any, res: any) => {
  const id: number = Number(req.query?.id);

  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }
  try {
    const options: FindOptions = {
      where: { id },
    };
    // @ts-ignore
    const game = await Game.findOne(options);
    res.status(200).json({ data: game, code: 0, message: "success" });
  } catch (error) {
    console.log("error----------------");
    console.log(error);
    res.status(500).json({ error });
  }
});

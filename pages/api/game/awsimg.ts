import { authMiddleware } from "../../lib/middleware";
const { Op } = require("sequelize");
import { models } from "../../config/db";
const { Game } = models;
import { uploadByFilename } from "../../utils/upload";
import { FindOptions } from "sequelize";

export default authMiddleware(async (req: any, res: any) => {
  try {
    const { gameId } = req.body;
    const options: FindOptions = {
      where: { id: gameId },
    };

    const game: any = await Game.findOne(options);
    const gameEntity: any = {
      gameplay_show: game?.gameplay_show,
      cover_url: game?.cover_url,
      logo: game?.logo,
      pictures: game?.pictures,
    };

    let uploadEntity: any = {};
    let hasList: any = [];
    if (
      gameEntity.gameplay_show &&
      gameEntity.gameplay_show.indexOf("bucket-oojxgn") < 0
    ) {
      uploadEntity.gameplay_show = await uploadByFilename(req, [
        gameEntity.gameplay_show,
      ]);
    } else {
      uploadEntity.gameplay_show = [gameEntity.gameplay_show];
    }
    if (
      gameEntity.cover_url &&
      gameEntity.gameplay_show.indexOf("bucket-oojxgn") < 0
    ) {
      uploadEntity.cover_url = await uploadByFilename(req, [
        gameEntity.cover_url,
      ]);
    } else {
      uploadEntity.cover_url = [gameEntity.cover_url];
    }
    if (
      gameEntity.logo &&
      gameEntity.gameplay_show.indexOf("bucket-oojxgn") < 0
    ) {
      uploadEntity.logo = await uploadByFilename(req, [gameEntity.logo]);
    } else {
      uploadEntity.logo = [gameEntity.logo];
    }
    if (gameEntity.pictures) {
      const pics = JSON.parse(gameEntity.pictures);
      const picsList = pics.map((item: any) => {
        if (item.indexOf("bucket-oojxgn") < 0) {
          return item;
        }
      });
      hasList = pics.map((item: any) => {
        if (item.indexOf("bucket-oojxgn") >= 0) {
          return item;
        }
      });
      uploadEntity.pictures = await uploadByFilename(req, picsList);
    }
    const params = {
      gameplay_show: uploadEntity.gameplay_show[0],
      cover_url: uploadEntity.cover_url[0],
      logo: uploadEntity.logo[0],
      pictures: JSON.stringify([...uploadEntity.pictures, ...hasList]),
    };
    await Game.update(params, {
      where: { id: gameId },
    });
    res.status(200).json({ data: { data: null, message: "ok", code: 0 } });
  } catch (error) {
    res.status(500).json({ error });
  }
});

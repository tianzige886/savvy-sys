import { authMiddleware } from "../../lib/middleware";
const { Op } = require("sequelize");
import { models } from "../../config/db";
const { WeekRecommend } = models;
import { uploadByFilename } from "../../utils/upload";
import { FindOptions } from "sequelize";

export default authMiddleware(async (req: any, res: any) => {
  try {
    const { commondId } = req.body;
    const options: FindOptions = {
      where: { id: commondId },
    };
    const game: any = await WeekRecommend.findOne(options);
    const commond: any = {
      cover_url: game?.cover_url,
    };
    let upload: any = {};
    if (commond.cover_url && commond.cover_url.indexOf("bucket-oojxgn") < 0) {
      upload.cover_url = await uploadByFilename(req, [commond.cover_url]);
    } else {
      upload.cover_url = [commond.cover_url];
    }

    const params = {
      cover_url: upload.cover_url[0],
    };
    await WeekRecommend.update(params, {
      where: { id: commondId },
    });
    res.status(200).json({ data: { data: null, message: "ok", code: 0 } });
  } catch (error) {
    res.status(500).json({ error });
  }
});

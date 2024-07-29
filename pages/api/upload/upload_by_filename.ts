import { authMiddleware } from "../../lib/middleware";
const { Op } = require("sequelize");
import { uploadByFilename } from "../../utils/upload";

export default authMiddleware(async (req: any, res: any) => {
  try {
    const images = await uploadByFilename(req);
    res.status(200).json({ data: { data: images, message: "ok", code: 0 } });
  } catch (error) {
    res.status(500).json({ error });
  }
});

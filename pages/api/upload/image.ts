import { authMiddleware } from "../../lib/middleware";
const { Op } = require("sequelize");
import { upload } from "../../utils/upload";

// 处理 multipart/form-data 请求
export const config = {
  api: {
    bodyParser: false,
  },
};

export default authMiddleware(async (req: any, res: any) => {
  try {
    const images = await upload(req);
    res.status(200).json({ data: { data: images, message: "ok", code: 0 } });
  } catch (error) {
    res.status(500).json({ error });
  }
});

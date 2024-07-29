import { authMiddleware } from "../../lib/middleware";
import { models } from "../../config/db";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import s3 from "../../lib/aws";
const { Game, HomeBanner, HomeHot, HomeRecommend, Tag, WeekRecommend } = models;

const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);
const unlinkAsync = promisify(fs.unlink);

export default authMiddleware(async (req: any, res: any) => {
  try {
    const game = await Game.findAll();
    const home_banner = await HomeBanner.findAll();
    const home_hot = await HomeHot.findAll();
    const home_recommend = await HomeRecommend.findAll();
    const tag = await Tag.findAll();
    const week_recommend = await WeekRecommend.findAll();

    const combinedData: any = {
      game: game,
      home_banner: home_banner,
      home_hot: home_hot,
      home_recommend: home_recommend,
      tag: tag,
      week_recommend: week_recommend,
    };

    const keys = Object.keys(combinedData);
    for (const key of keys) {
      const data = combinedData[key];
      // 导出为 JSON 文件
      const jsonFilePath = path.join(process.cwd(), "data.json");
      await writeFileAsync(jsonFilePath, JSON.stringify(data, null, 2));
      // 读取文件内容
      const fileContent = await readFileAsync(jsonFilePath);
      // 配置 S3 上传参数
      const params = {
        Bucket: "bucket-oojxgn", // 桶名称
        Key: `database/${key}.json`, // 文件路径以及文件名
        Body: fileContent,
        ContentType: "application/json",
      };
      // 上传到 S3
      await s3.upload(params).promise();
      // 删除本地文件
      await unlinkAsync(jsonFilePath);
    }

    res
      .status(200)
      .json({ data: { message: "File uploaded successfully", code: 0 } });
  } catch (error) {
    res.status(500).json({ error });
  }
});

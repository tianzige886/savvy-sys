import { createServer } from "https";
import { parse } from "url";
import next from "next";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
const port = 443;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
import { initModels } from "./pages/models";
// import { sequelize } from "./pages/config/db";
// const checkAndCreateTables = require("./checkTable");
// import { initModels } from "./pages/models";
// import { sequelize } from "./pages/config/db";
import { sequelize, models } from "./pages/config/db";

const httpsOptions = {
  key: fs.readFileSync("localhost+2-key.pem"),
  cert: fs.readFileSync("localhost+2.pem"),
};

// 检查表是否存在，不存在根据数据模型自动创建
// checkAndCreateTables();

app.prepare().then(() => {
  // 同步模型
  sequelize
    .sync({ alter: true })
    .then(() => {
      console.log("Database synchronized, tables updated.");

      createServer(httpsOptions, (req, res) => {
        // @ts-ignore
        const parsedUrl = parse(req.url, true);
        // @ts-ignore
        handle(req, res, parsedUrl);
        // @ts-ignore
      }).listen(port, "", () => {
        // @ts-ignore
        // if (err) throw err;
        // @ts-ignore
        console.log("ready - started server on url: https://localhost:" + port);
      });
    })
    .catch((error) => {
      console.error("Error synchronizing database:", error);
    });
});

// 初始化模型
initModels(sequelize);

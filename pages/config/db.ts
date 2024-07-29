import { Sequelize, Options } from "sequelize";
import { initModels } from "../models"; // 导入初始化模型的函数
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE!,
  process.env.MYSQL_USER!,
  process.env.MYSQL_PASSWORD!,
  {
    host: process.env.MYSQL_HOST!,
    dialect: "mysql",
    port: Number(process.env.MYSQL_PORT) || 3306,
  }
);

// 初始化模型
const models = initModels(sequelize);

export { sequelize, models };

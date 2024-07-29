const sequelize = require("./pages/lib/db");
const models = require("./pages/models");

module.exports = async function checkAndCreateTables() {
  try {
    // 获取所有模型
    const modelNames = Object.keys(models);
    const tableExists = await sequelize.getQueryInterface().showAllTables();
    // 检查并创建每个模型的表
    for (const modelName of modelNames) {
      const model = models[modelName];
      if (!tableExists.includes(model)) {
        await model.sync({ force: false });
        console.log(`${modelName} table checked and created if not exist!`);
      }
    }
  } catch (error) {
    console.error("Error checking or creating tables:", error);
  }
};

module.exports = {
  development: {
    dialect: "mysql",
    database: process.env.MYSQL_DATABASE,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    // host: process.env.MYSQL_DB_HOST || 'localhost',
    // port: parseInt(process.env.MYSQL_DB_PORT || '3306')
  },
  test: {
    dialect: "mysql",
    database: process.env.MYSQL_DATABASE,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    // host: process.env.MYSQL_DB_HOST || 'localhost',
    // port: parseInt(process.env.MYSQL_DB_PORT || '3306')
  },
  production: {
    dialect: "mysql",
    database: process.env.MYSQL_DATABASE,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    // host: process.env.MYSQL_DB_HOST,
    // port: parseInt(process.env.MYSQL_DB_PORT),
  },
};

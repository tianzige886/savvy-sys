module.exports = {
  apps: [
    {
      name: "savvy-sys", // 你的应用程序名称
      script: "npm",
      args: "run dev",
      watch: true, // 如果你想要监视文件变化自动重启应用
      env: {
        NODE_ENV: "development",
        MYSQL_HOST: "44.214.134.96",
        MYSQL_USER: "admin",
        MYSQL_PASSWORD: "JJt9rYTH__hGC?iyYX",
        MYSQL_DATABASE: "admin",
        JWT_SECRET_KEY: "ap0526g9-9734-1044-8ea3-5a124ed05da0",
        AWS_ACCESS_KEY_ID: "AKIAW3MEFRT7TVAYBKEV",
        AWS_SECRET_ACCESS_KEY: "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",
        AWS_REGION: "ap-southeast-1",
      },
    },
  ],
};

// pages/api/upload/image_local.js

import multer from "multer";
import fs from "fs";
// import path from "path";

// 确保上传目录存在
const uploadDir = "./public/uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 配置 multer 存储
const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

export const config = {
  api: {
    bodyParser: false, // 关闭内置的 bodyParser，以便使用 multer 处理 multipart/form-data
  },
};

export default function handler(req: any, res: any) {
  if (req.method === "POST") {
    upload.single("file")(req, res, (err: any) => {
      if (err) {
        return res.status(500).json({ error: `Server Error: ${err.message}` });
      }
      res.status(200).json({
        data: `/uploads/${req.file.filename}`,
        code: 0,
        message: "success",
      });
    });
  } else {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  }
}

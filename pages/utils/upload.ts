import fs from "fs";
import path from "path";
import s3 from "../lib/aws";
import * as formidable from "formidable";
import { NextApiRequest } from "next";

const uploadToAws = async (
  file: any,
  folder: string,
  filename: string = "upload"
) => {
  let fileContent: any = null;
  let fileName = filename;
  const params = {
    Bucket: "bucket-oojxgn", // 桶名称
    Key: `${folder}/${fileName}`,
    Body: fileContent,
    ContentType: "",
  };
  if (typeof file === "string") {
    fileContent = fs.createReadStream(file);
    params.ContentType = "image/*";
  } else {
    fileContent = fs.readFileSync(file.filepath);
    fileName = file.originalFilename || "upload";
    params.ContentType = file.mimetype || "application/octet-stream";
  }
  params.Body = fileContent;
  params.Key = `${folder}/${fileName}`;

  return s3.upload(params).promise();
};
// 根据文件名查找本地文件进行上传
export const uploadByFilename = (
  req: NextApiRequest,
  inputFiles: any = [],
  folder: string = "imageUpload"
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  return new Promise(async (resolve, reject) => {
    const { files } = req.body;
    let fileList: any = [];

    if (inputFiles.length > 0) {
      fileList = inputFiles;
    } else {
      const { files } = req.body;
      fileList = JSON.parse(files);
    }

    if (fileList.length === 0) {
      return Promise.reject(new Error("No files uploaded"));
    }

    const uploadPromises = fileList.map((filePath: any) => {
      const resolvedPath = path.join(process.cwd(), "/public", filePath);
      const fileName = path.basename(resolvedPath);

      if (!fs.existsSync(resolvedPath)) {
        reject(new Error(`File not found: ${resolvedPath}`));
      }
      return uploadToAws(resolvedPath, folder, fileName);
    });
    const results: any = await Promise.all(uploadPromises);
    const imgList = results.map((img: any) => img.Location);
    resolve(imgList);
  });
};
// 直接上传
export const upload = (
  req: NextApiRequest,
  folder: string = "imageUpload"
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  return new Promise((resolve, reject) => {
    const form: any = new formidable.IncomingForm();
    const uploadDir = path.join(process.cwd(), "./");
    form.uploadDir = uploadDir;
    form.keepExtensions = true;

    form.parse(
      req,
      async (err: any, fields: formidable.Fields, files: formidable.Files) => {
        if (err) reject(err);

        const fileList: any = Array.isArray(files.file)
          ? files.file
          : [files.file];

        const uploadPromises = fileList.map((file: any) => {
          return uploadToAws(file, folder);
        });

        const results: any = await Promise.all(uploadPromises);

        const imgList = results.map((img: any) => img.Location);

        fileList.forEach((file: any) => fs.unlinkSync(file.filepath));

        resolve(imgList);
      }
    );
  });
};

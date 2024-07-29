"use client";
import { useState, useRef, useEffect } from "react";
import {
  Button,
  Divider,
  Input,
  List,
  Upload,
  UploadFile,
  message,
} from "antd";
import { uploadImage, uploadImageByNames, uploadJson } from "@/services/points";
import React from "react";
import Layout from "@/components/Layout";
import styles from "../index.module.less";
import { usePathname } from "next/navigation";
import PermitButton from "@/components/button";

const { Search } = Input;
const Page: React.FC = () => {
  const [userInfo, setUserInfo] = useState<any>({});
  const pathname: any = usePathname();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [jsonLoading, setJsonLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [pathLaoding, setPathLoading] = useState(false);

  useEffect(() => {
    const user = window.localStorage.getItem("balance_sys_user");
    if (user) {
      setUserInfo(JSON.parse(user));
    }
  }, []);

  const upload = async () => {
    try {
      setJsonLoading(true);
      const res: any = await uploadJson();
      if (res.data.code === 0) {
        message.success("JSON数据上传成功");
      }
      setJsonLoading(false);
    } catch (error) {
      message.error("JSON数据上传失败");
      setJsonLoading(false);
    }
  };

  const uploadChange = ({ fileList }: { fileList: UploadFile[] }) =>
    setFileList(fileList);

  const uploadImg = async () => {
    if (fileList.length === 0) {
      message.error("请选择要上传的图片");
      return;
    }
    try {
      setImgLoading(true);
      const formData = new FormData();
      fileList.forEach((file) => {
        formData.append("file", file.originFileObj as Blob);
      });
      const res: any = await uploadImage(formData);
      if (res.data.code === 0) {
        message.success("图片上传成功");
      } else {
        message.error("图片上传失败");
      }
      setImgLoading(false);
    } catch (error) {
      setImgLoading(false);
      message.error("图片上传失败");
    }
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as Blob);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const uploadByFileName = async () => {
    try {
      const param = [
        "/uploads/1722045291121-heroVoting.png",
        "/uploads/1722045305274-image.webp",
        "/uploads/1722045333162-image.avif",
        "/uploads/1722045359488-image (1).avif",
      ];

      setPathLoading(true);
      const res: any = await uploadImageByNames({
        files: JSON.stringify(param),
      });
      if (res.data.code === 0) {
        message.success("JSON数据上传成功");
      }
      setPathLoading(false);
    } catch (error) {
      message.error("JSON数据上传失败");
      setPathLoading(false);
    }
  };

  return (
    <Layout curActive="/system/upload">
      <List bordered>
        <List.Item>
          <PermitButton
            onClick={upload}
            type="primary"
            loading={jsonLoading}
            path={pathname}
            permit={2}
          >
            同步并上传
          </PermitButton>
        </List.Item>
        <List.Item>查询所有游戏相关表并且导出JSON文件上传到AWS</List.Item>
      </List>
      <Divider />
      <List bordered>
        <List.Item>
          <PermitButton
            onClick={uploadByFileName}
            type="primary"
            loading={pathLaoding}
            path={pathname}
            permit={2}
          >
            根据文件路径上传图片
          </PermitButton>
        </List.Item>
        <List.Item>根据文件路径上传图片到AWS</List.Item>
      </List>
      <Divider />
      <List bordered>
        <List.Item>
          <Upload
            onChange={uploadChange}
            beforeUpload={() => false}
            multiple={true}
            fileList={fileList}
            listType="picture-card"
            onPreview={onPreview}
          >
            + Upload
          </Upload>
        </List.Item>
        <List.Item>
          <PermitButton
            onClick={uploadImg}
            type="primary"
            loading={imgLoading}
            path={pathname}
            permit={2}
          >
            开始上传
          </PermitButton>
        </List.Item>
        <List.Item>
          上传图片到AWS，可以单个图片上传也可以批量上传，先选择要上传的图片，点击
          开始上传 按钮进行操作
        </List.Item>
      </List>
    </Layout>
  );
};

export default Page;

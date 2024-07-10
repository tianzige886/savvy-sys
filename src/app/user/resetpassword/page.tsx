"use client";
import { useState, useRef, useEffect } from "react";
import { Col, Row, Button, Form, Input, message } from "antd";
import React from "react";
import Layout from "@/components/Layout";
import { ResetpasswordType } from "./resetpassword.type";
import JsMd5 from "js-md5";
import { ResetPassword } from "@/services/users";
import { LOCALSTORAGE_TOKEN, LOCALSTORAGE_USER } from "@/constants";

const Page: React.FC = () => {
  const [form] = Form.useForm();
  const [user, setUser] = useState<any>();

  const onFinish = async (values: ResetpasswordType) => {
    const pass = mixPassword(values.password, user.username);
    try {
      const res: any = await ResetPassword(user.username, pass);
      if (res.code === 0) {
        message.success("修改成功");
        window.localStorage.removeItem(LOCALSTORAGE_TOKEN);
        window.localStorage.removeItem(LOCALSTORAGE_USER);
        window.location.href = "/";
      } else {
        message.error(res.message);
      }
    } catch (e) {
      message.error(JSON.stringify(e));
    }
  };
  const mixPassword = (password: string, salt: string) => {
    return JsMd5.md5(password + salt);
  };

  useEffect(() => {
    const userStorage = window.localStorage.getItem(LOCALSTORAGE_USER);
    const user = userStorage && JSON.parse(userStorage);
    setUser(user);
  }, []);

  return (
    <Layout curActive="/dashboard/users/manage">
      <div
        style={{
          width: 500,
          margin: "0 auto",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Form
          form={form}
          initialValues={{ username: user.username }}
          onFinish={(values) => onFinish(values)}
        >
          <Form.Item name={"username"} rules={[{ required: true }]}>
            <Input disabled={true} placeholder={"User Name"} />
          </Form.Item>
          <Form.Item name={"password"} rules={[{ required: true }]}>
            <Input placeholder={"New Password"} />
          </Form.Item>
        </Form>
        <Button type={"primary"} onClick={() => form.submit()}>
          确认修改
        </Button>
      </div>
    </Layout>
  );
};

export default Page;

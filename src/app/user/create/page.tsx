"use client";
import { useState, useRef } from "react";
import { Button, Form, message, Input } from "antd";
import React from "react";
import Layout from "@/components/Layout";
import { SubmitValuesType } from "./CreateUserModal.type";
import { CreateUser } from "@/services/users";
import JsMd5 from "js-md5";

const Page: React.FC = () => {
  const [form] = Form.useForm();
  const [initPassword, setInitPassword] = useState<string>("balance.game111");
  const onFinish = async (values: SubmitValuesType) => {
    const pass = mixPassword(values.username);
    try {
      const res: any = await CreateUser(values.username, pass);
      if (res.code === 0) {
        message.success("新增成功");
        alert(`用户名：${values.username} 密码：${initPassword}`);
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } else {
        message.error(res.message);
      }
    } catch (e) {
      message.error(JSON.stringify(e));
    }
  };

  const mixPassword = (salt: string) => {
    return JsMd5.md5(initPassword + salt);
  };
  return (
    <Layout curActive="/dashboard/user/create">
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
          initialValues={{ password: initPassword }}
          onFinish={(values) => onFinish(values)}
        >
          <Form.Item
            name={"username"}
            rules={[
              { required: true, message: "Please input Email" },
              { type: "email", message: "邮箱格式不正确" },
            ]}
          >
            <Input placeholder={"Email"} />
          </Form.Item>
          <Form.Item name={"password"} rules={[{ required: true }]}>
            <Input placeholder={"password"} disabled={true} />
          </Form.Item>
        </Form>
        <Button type={"primary"} onClick={() => form.submit()}>
          提交
        </Button>
      </div>
    </Layout>
  );
};

export default Page;

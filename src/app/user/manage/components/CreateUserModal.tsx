"use client";
import { useState, useRef } from "react";
import { Col, Form, Modal, Row, Button, Input, message } from "antd";
import React from "react";
import { CreateUserModalType, SubmitValuesType } from "./CreateUserModal.type";
import { CreateUser } from "@/services/users/index";
import JsMd5 from "js-md5";

const CreateUserModal: React.FC = (props: CreateUserModalType) => {
  const { visible, onClose, onOk } = props;
  const [form] = Form.useForm();
  const [initPassword, setInitPassword] = useState<string>("balance.game111");

  const onFinish = async (values: SubmitValuesType) => {
    const pass = mixPassword(values.username);
    try {
      const res: any = await CreateUser(values.username, pass);
      if (res.code === 0) {
        message.success("新增成功");
        onOk({ username: values.username, password: initPassword });
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
    <>
      <Modal
        visible={visible}
        onClose={() => onClose()}
        onOk={() => form.submit()}
        title={"新增用户"}
      >
        <Form
          form={form}
          initialValues={{ password: initPassword }}
          onFinish={(values) => onFinish(values)}
        >
          <Form.Item name={"username"} rules={[{ required: true }]}>
            <Input placeholder={"User Name"} />
          </Form.Item>
          <Form.Item name={"password"} rules={[{ required: true }]}>
            <Input placeholder={"password"} disabled={true} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateUserModal;

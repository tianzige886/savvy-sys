"use client";
// import { useTranslations } from "next-intl";
import { Button, Form, Input, Segmented, type FormProps } from "antd";
// import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginApi, getUserInfo } from "@/services/users";
import { LOCALSTORAGE_TOKEN, LOCALSTORAGE_USER } from "@/constants";

import styles from "./index.module.less";

type FieldType = {
  username?: string;
  password?: string;
};

// const mode = ["登录"];

export default function Home() {
  // const t = useTranslations();
  // const [curMode, setCurMode] = useState(mode[0]);
  const [form] = Form.useForm();
  const router = useRouter();

  const fetchUserInfo = async () => {
    const res = await getUserInfo();
    const userInfo = res.data;
    if (userInfo) {
      window.localStorage.setItem(LOCALSTORAGE_USER, JSON.stringify(userInfo));
    }
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values: any) => {
    const { username, password } = values;
    loginApi(username, password).then(async (res: any) => {
      if (res?.code === 0) {
        window.localStorage.setItem(
          LOCALSTORAGE_TOKEN,
          res?.data?.access_token
        );
        await fetchUserInfo();
      }
      window.setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    });
    return;
  };

  return (
    <main className={styles.loginWrap}>
      <div className={styles.content}>
        <div className={styles.innerContent}>
          <h1>Balance.game</h1>
          <Form
            name="basic"
            className={styles.form}
            wrapperCol={{ span: 24 }}
            // style={{ maxWidth: 420 }}
            form={form}
            onFinish={onFinish}
            initialValues={{
              email: "dooring@next.com",
              pwd: "dooring.vip",
            }}
            autoComplete="off"
          >
            <>
              <Form.Item<FieldType>
                name="username"
                rules={[
                  {
                    required: true,
                    message: "请输入user name",
                  },
                ]}
              >
                <Input
                  placeholder="请输入用户名"
                  size="large"
                  variant="filled"
                />
              </Form.Item>

              <Form.Item<FieldType>
                name="password"
                rules={[{ required: true, message: "请输入密码" }]}
              >
                <Input.Password
                  size="large"
                  placeholder="请输入密码"
                  variant="filled"
                />
              </Form.Item>

              <Form.Item wrapperCol={{ span: 24 }}>
                <Button type="primary" htmlType="submit" block size="large">
                  登录
                </Button>
              </Form.Item>
            </>
          </Form>
        </div>
      </div>
    </main>
  );
}

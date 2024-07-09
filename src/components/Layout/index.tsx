"use client";
import React, { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  theme,
  Avatar,
  Dropdown,
  ConfigProvider,
  Badge,
  Popover,
  type MenuProps,
} from "antd";
import getNavList from "./menu";
import { useRouter, usePathname } from "next/navigation";
// import { useLocale, useTranslations } from "next-intl";
import {
  BellOutlined,
  MoonOutlined,
  SunOutlined,
  TransactionOutlined,
} from "@ant-design/icons";
import { getThemeBg } from "@/utils";
// import { Link, pathnames, usePathname } from "../../navigation";
import styles from "./index.module.less";
import { LOCALSTORAGE_TOKEN, LOCALSTORAGE_USER } from "@/constants";

const { Header, Content, Footer, Sider } = Layout;

interface IProps {
  children: React.ReactNode;
  curActive: string;
  defaultOpen?: string[];
}

const onLogout = () => {
  localStorage.removeItem("isDarkTheme");
  localStorage.removeItem(LOCALSTORAGE_USER);
  localStorage.removeItem(LOCALSTORAGE_TOKEN);
};

const items: MenuProps["items"] = [
  // {
  //   key: "1",
  //   label: (
  //     <a target="_blank" rel="noopener noreferrer" href="#">
  //       个人中心
  //     </a>
  //   ),
  // },
  // {
  //   key: "2",
  //   label: (
  //     <a target="_blank" rel="noopener noreferrer" href="#">
  //       切换账户
  //     </a>
  //   ),
  // },
  {
    key: "3",
    label: (
      <a
        target="_blank"
        onClick={onLogout}
        rel="noopener noreferrer"
        href="/user/login"
      >
        退出登录
      </a>
    ),
  },
];

const CommonLayout: React.FC<IProps> = ({
  children,
  curActive,
  defaultOpen = ["/"],
}) => {
  const {
    token: { borderRadiusLG, colorTextBase, colorWarningText },
  } = theme.useToken();

  const [user, setUser] = useState<any>();

  // const t = useTranslations("global");

  // const locale = useLocale();
  // const otherLocale: any = locale === "en" ? ["zh", "中"] : ["en", "En"];

  const router = useRouter();
  const pathname = usePathname();
  const navList = getNavList();

  const [curTheme, setCurTheme] = useState<boolean>(false);
  const toggleTheme = () => {
    const _curTheme = !curTheme;
    setCurTheme(_curTheme);
    localStorage.setItem("isDarkTheme", _curTheme ? "true" : "");
  };

  const handleSelect = (row: { key: string }) => {
    router.push(row.key);
  };

  useEffect(() => {
    const isDark = !!localStorage.getItem("isDarkTheme");
    setCurTheme(isDark);
    const userInfo: any = window.localStorage.getItem(LOCALSTORAGE_USER);
    setUser(JSON.parse(userInfo));
  }, []);

  return (
    <ConfigProvider
      theme={{
        algorithm: curTheme ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          theme={curTheme ? "dark" : "light"}
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={(broken) => {}}
          onCollapse={(collapsed, type) => {}}
        >
          <span className={styles.logo} style={getThemeBg(curTheme)}>
            Balance.game
          </span>
          <Menu
            theme={curTheme ? "dark" : "light"}
            mode="inline"
            defaultSelectedKeys={[curActive]}
            items={navList}
            defaultOpenKeys={defaultOpen}
            onSelect={handleSelect}
          />
        </Sider>
        <Layout>
          <Header
            style={{ padding: 0, ...getThemeBg(curTheme), display: "flex" }}
          >
            <div className={styles.rightControl}>
              <span onClick={toggleTheme} className={styles.theme}>
                {!curTheme ? (
                  <SunOutlined style={{ color: colorWarningText }} />
                ) : (
                  <MoonOutlined />
                )}
              </span>
              <div className={styles.avatar}>
                <Dropdown menu={{ items }} placement="bottomLeft" arrow>
                  <Avatar
                    style={{ color: "#fff", backgroundColor: colorTextBase }}
                  >
                    {user?.username || "Admin"}
                  </Avatar>
                </Dropdown>
              </div>
            </div>
          </Header>
          <Content style={{ margin: "24px 16px 0" }}>
            <div
              style={{
                padding: 24,
                minHeight: 520,
                ...getThemeBg(curTheme),
                borderRadius: borderRadiusLG,
              }}
            >
              {children}
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Balance.game ©{"2024"}
            {/*<a href="https://github.com/MrXujiang">徐小夕</a>*/}
          </Footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default CommonLayout;

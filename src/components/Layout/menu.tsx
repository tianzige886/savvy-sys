import {
  FundOutlined,
  LayoutOutlined,
  BarChartOutlined,
  DesktopOutlined,
  ScheduleOutlined,
  CalculatorOutlined,
  UserOutlined,
  WalletOutlined,
  BuildOutlined,
  OpenAIOutlined,
  PartitionOutlined,
  FileExcelOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import React from "react";

const getNavList = () => {
  return [
    {
      key: "/",
      icon: <DesktopOutlined />,
      label: "积分管理",
      children: [
        {
          key: "/dashboard",
          icon: null,
          label: "签到数据",
        },
        {
          key: "/dashboard/users",
          icon: null,
          label: "用户积分",
        },
      ],
    },
    {
      key: "/user",
      icon: <DesktopOutlined />,
      label: "用户管理",
      children: [
        {
          key: "/user/manage",
          icon: null,
          label: "用户管理",
        },
      ],
    },
  ];
};

export default getNavList;

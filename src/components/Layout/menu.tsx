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
          label: "签到统计数据",
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
          key: "/user/create",
          icon: null,
          label: "新增用户",
        },
      ],
    },
  ];
};

export default getNavList;

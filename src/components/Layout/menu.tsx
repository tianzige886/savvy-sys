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
          label: "汇总数据",
        },
        {
          key: "/dashboard/users",
          icon: null,
          label: "用户数据",
        },
      ],
    },
  ];
};

export default getNavList;

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
          name: "dashboard_index",
          defaultOpen: true,
          label: "签到统计数据",
        },
        {
          key: "/dashboard/users",
          icon: null,
          name: "dashboard_users",
          label: "用户积分",
        },
      ],
    },
    {
      key: "/marketing",
      icon: <DesktopOutlined />,
      label: "运营管理",
      children: [
        {
          key: "/marketing/banners",
          icon: null,
          name: "marketing_home_banners",
          label: "首页Banner",
        },
        {
          key: "/marketing/banneradult",
          icon: null,
          name: "marketing_banners_adult",
          label: "首页Banner审核",
        },
        {
          key: "/marketing/hot",
          name: "marketing_home_weeks",
          icon: null,
          label: "热门游戏",
        },
        {
          key: "/marketing/hotadult",
          name: "marketing_home_hotadult",
          icon: null,
          label: "热门游戏审核",
        },
        {
          key: "/marketing/recommend",
          icon: null,
          name: "marketing_home_recommend",
          label: "推荐游戏",
        },
        {
          key: "/marketing/recommendadult",
          icon: null,
          name: "marketing_home_recommendadult",
          label: "推荐游戏审核",
        },
        {
          key: "/marketing/weekRecommend",
          icon: null,
          name: "marketing_home_hot",
          label: "一周推荐",
        },
        {
          key: "/marketing/weekRecommendadult",
          icon: null,
          name: "marketing_home_weekRecommendadult",
          label: "一周推荐审核",
        },
      ],
    },
    {
      key: "/games",
      icon: <DesktopOutlined />,
      label: "游戏管理",
      children: [
        {
          key: "/games/list",
          name: "games_list",
          icon: null,
          label: "游戏列表",
        },
        {
          key: "/games/adult",
          name: "adult_list",
          icon: null,
          label: "游戏列表审核",
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
          name: "user_create",
          label: "新增用户",
        },
        {
          key: "/user/list",
          icon: null,
          name: "user_list",
          label: "用户列表",
        },
        {
          key: "/user/permission",
          icon: null,
          name: "user_permission",
          label: "权限列表",
        },
      ],
    },
    {
      key: "/system",
      icon: <WalletOutlined />,
      label: "系统设置",
      children: [
        {
          key: "/system/upload",
          name: "system_upload",
          icon: null,
          label: "数据上传",
        },
      ],
    },
  ];
};

export default getNavList;

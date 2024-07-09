"use client";
import { useEffect, useState } from "react";
import {
  Card,
  // Form,
  // Input
} from "antd";
import { Col, Row, Statistic } from "antd";
import * as echarts from "echarts/core";
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
} from "echarts/components";
import { LineChart } from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import {
  getCheckinData,
  getCheckinDayDataForCharts,
  getCheckinTotalDataForCharts,
} from "@/services/points";
import React from "react";
import { CSVLink } from "react-csv";
// const { Search } = Input;
import Layout from "@/components/Layout";

echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
  DataZoomComponent,
]);

const Index: React.FC = () => {
  // const [form] = Form.useForm();
  const [statisticData, setStatisticData] = useState<any>();
  const [dayData, setDayData] = useState<any[]>([]);
  const [totalData, setTotalData] = useState<any[]>([]);
  // const submit = async (values) => {
  //   console.log(values);
  // };

  const dayDataHeaders = [
    { label: "日期", key: "day" },
    { label: "日签到数", key: "day_checkin" },
    { label: "日新增用户", key: "day_user" },
  ];

  const totalDataHeaders = [
    { label: "日期", key: "day" },
    { label: "累积签到数", key: "total_checkin" },
    { label: "累积用户数", key: "total_user" },
  ];

  const getStatistic = async () => {
    try {
      const res: any = await getCheckinData({});
      if (res?.code === 0) {
        setStatisticData(res?.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getTodayCharts = async () => {
    try {
      const res: any = await getCheckinDayDataForCharts({});
      const data = res?.data?.history_checkin_day || [];
      setDayData(data);
      let dates: string[] = [];
      let checkInData: number[] = [];
      let newUsersData: number[] = [];
      for (let item of data) {
        dates.push(item.day);
        checkInData.push(item?.day_checkin);
        newUsersData.push(item?.day_user);
      }
      const todayChartDom = document.getElementById("todayCharts");
      let myTodayChart = echarts.init(todayChartDom);
      let todayOption;
      todayOption = {
        title: {
          text: "Daily",
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["日签到数", "日新增用户"],
        },
        grid: {
          left: "3%",
          right: "4%",
          height: "80%",
          bottom: "10%",
          containLabel: true,
        },
        toolbox: {
          feature: {
            // saveAsImage: {},
          },
        },
        dataZoom: [
          {
            type: "inside",
            start: 0,
            end: 50,
          },
          {
            type: "slider",
            top: "95%",
            width: "95%",
            height: 20,
            left: 8,
          },
        ],
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: dates,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "签到数",
            type: "line",
            stack: "Total",
            smooth: true,
            data: checkInData,
          },
          {
            name: "新增地址数",
            type: "line",
            stack: "Total",
            smooth: true,
            data: newUsersData,
          },
        ],
      };
      todayOption && myTodayChart.setOption(todayOption);
    } catch (e) {
      console.error(e);
    }
  };

  const getTotalCharts = async () => {
    try {
      const res: any = await getCheckinTotalDataForCharts({});
      const data = res?.data?.history_checkin_total || [];
      setTotalData(data);
      let dates: string[] = [];
      let checkInData: number[] = [];
      let newUsersData: number[] = [];
      for (let item of data) {
        dates.push(item.day);
        checkInData.push(item?.total_checkin);
        newUsersData.push(item?.total_user);
      }
      const totalChartDom = document.getElementById("totalCharts");
      let myTotalChart = echarts.init(totalChartDom);
      let totalOption;

      totalOption = {
        title: {
          text: "Total",
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["累计签到数", "累计地址数"],
        },
        grid: {
          left: "3%",
          right: "4%",
          height: "80%",
          bottom: "10%",
          containLabel: true,
        },
        toolbox: {
          feature: {
            // saveAsImage: {},
          },
        },
        dataZoom: [
          {
            type: "inside",
            start: 0,
            end: 50,
          },
          {
            type: "slider",
            top: "95%",
            width: "95%",
            height: 20,
            left: 8,
          },
        ],
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: dates,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "累计签到数",
            type: "line",
            stack: "Total",
            data: checkInData,
          },
          {
            name: "累计地址数",
            type: "line",
            stack: "Total",
            data: newUsersData,
          },
        ],
      };

      totalOption && myTotalChart.setOption(totalOption);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getStatistic();
    getTodayCharts();
    getTotalCharts();
  }, []);

  return (
    <Layout curActive="/dashboard">
      <Row gutter={24} justify={"center"}>
        <Col span={5}>
          <Card>
            <Statistic
              title="昨日签到数量"
              value={statisticData?.day_checkin}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="昨日新增地址数量"
              value={statisticData?.day_user}
            />
          </Card>
        </Col>
        <Col span={5}>
          <Card>
            <Statistic
              title="累计签到数量"
              value={statisticData?.total_checkin}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="累计地址数量" value={statisticData?.total_user} />
          </Card>
        </Col>
      </Row>
      <br />
      <Row gutter={24} justify={"end"}>
        <Col span={4}>
          <CSVLink data={dayData} headers={dayDataHeaders} target="_blank">
            {"下载日统计数据表格>"}
          </CSVLink>
        </Col>
        <Col span={4}>
          <CSVLink data={totalData} headers={totalDataHeaders} target="_blank">
            {"下载累计数据表格>"}
          </CSVLink>
        </Col>
      </Row>
      <br />
      <Row gutter={24} justify={"center"}>
        <Col span={24}>
          <div id={"todayCharts"} style={{ height: "500px" }} />
        </Col>
      </Row>
      <br />
      <br />
      <br />
      <Row gutter={24} justify={"center"}>
        <Col span={24}>
          <div id={"totalCharts"} style={{ height: "500px" }} />
        </Col>
      </Row>
    </Layout>
  );
};

export default Index;

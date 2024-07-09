"use client";
import { useState, useRef } from "react";
import {
  Card,
  Col,
  Form,
  Input,
  Row,
  Statistic,
  Table,
  Tabs,
  Typography,
} from "antd";
import { getUserCheckinData } from "@/services/points";
import { UserPointsDataType } from "@/constants/types.td";
import React from "react";
import Layout from "@/components/Layout";

const { Search } = Input;
const { Text } = Typography;

const Page: React.FC = () => {
  const [disabledStatus, setDisabledStatus] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [userDataList, setUserDataList] = useState<UserPointsDataType[]>();
  const timer = useRef<any>();
  const [tabKey, setTabKey] = useState<any>("1");
  const [wallet, setWallet] = useState<string>("");
  const [signCreadit, setSignCreadit] = useState<any>(0);
  const [oauthCreadit, setOauthCreadit] = useState<any>(0);
  const [inviteCreadit, setInviteCreadit] = useState<any>(0);
  const [totalCreadit, setTotalCreadit] = useState<any>(0);

  const columns: any = [
    {
      title: "日期",
      dataIndex: "day",
      key: "day",
    },
    {
      title: "本次签到分",
      dataIndex: "curChkPoints",
      key: "curChkPoints",
    },
    {
      title: "连续签到天数",
      dataIndex: "streak",
      key: "streak",
    },
    {
      title: "总分",
      dataIndex: "totalPoints",
      key: "totalPoints",
    },
    {
      title: "Network",
      dataIndex: "network",
      key: "network",
    },
    {
      title: "Hash",
      dataIndex: "hash",
      key: "hash",
    },
  ];

  const inviteColumns = [
    {
      title: "日期",
      dataIndex: "day",
      key: "day",
    },
    {
      title: "奖励积分",
      dataIndex: "invite_credit",
      key: "invite_credit",
    },
    {
      title: "邀请地址",
      dataIndex: "child_wallet",
      key: "child_wallet",
    },
  ];

  const bindColumns = [
    {
      title: "日期",
      dataIndex: "day",
      key: "day",
    },
    {
      title: "绑定Twitter",
      dataIndex: "bind_credit_twitter",
      key: "bind_credit_twitter",
    },
    {
      title: "关注Twitter",
      dataIndex: "follow_credit_twitter",
      key: "follow_credit_twitter",
    },
    {
      title: "绑定Discord",
      dataIndex: "bind_credit_discord",
      key: "bind_credit_discord",
    },
    {
      title: "加入Discord",
      dataIndex: "follow_credit_discord",
      key: "follow_credit_discord",
    },
  ];

  const [currentColunms, setCurrentColunms] = useState<any>(columns);

  const labels: any = {
    1: "签到记录",
    2: "邀请记录",
    3: "账号授权记录",
  };

  const getUsersData = async (address?: string, type?: string) => {
    try {
      setDisabledStatus(true);
      const res: any = await getUserCheckinData({ wallet: address, type });
      const entity: any = res?.data;
      setSignCreadit(entity?.total_checkin_credit);
      setOauthCreadit(entity?.total_bind_credit);
      setInviteCreadit(entity?.total_invite_credit);
      setTotalCreadit(entity?.total_credit);
      setUserDataList(entity?.itmes);
      timer.current = window.setTimeout(() => {
        setDisabledStatus(false);
      }, 5000);
    } catch (e) {
      setDisabledStatus(false);
      console.error(e);
    }
  };

  const submit = async (values: any) => {
    try {
      setWallet(values.address);
      getUsersData(values.address, tabKey);
    } catch (e) {}
  };

  const tabChange = (key: any) => {
    setTabKey(key);
    setUserDataList([]);
    setCurrentColunms(
      key == 1 ? columns : key == 2 ? inviteColumns : bindColumns
    );
    if (!wallet) {
      setUserDataList([]);
    } else {
      getUsersData(wallet, key);
    }
  };

  return (
    <Layout curActive="/dashboard/users">
      <Row gutter={24} justify={"center"}>
        <Col span={6}>
          <Card>
            <Statistic title="累计签到积分" value={signCreadit} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="累计邀请积分" value={inviteCreadit} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="累计授权积分" value={oauthCreadit} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="总积分" value={totalCreadit} />
          </Card>
        </Col>
      </Row>
      <br />
      <Text type="secondary">tips: 间隔每5秒中查询一次,以减轻服务器压力</Text>
      <br />
      <br />
      <Form form={form} onFinish={(values) => submit(values)}>
        <Form.Item
          name={"address"}
          rules={[
            { required: true },
            {
              pattern: /^0x[a-fA-F0-9]{40}$/,
              message: "Please input a correct address",
            },
          ]}
        >
          <Search
            size={"large"}
            onSearch={() => form.submit()}
            enterButton
            disabled={disabledStatus}
            placeholder={"0x"}
          />
        </Form.Item>
      </Form>
      <Tabs
        defaultActiveKey={tabKey}
        type="card"
        onChange={tabChange}
        items={new Array(3).fill(null).map((_, i) => {
          const id = String(i + 1);
          return {
            label: labels[id],
            key: id,
          };
        })}
      />
      <Table
        pagination={false}
        columns={currentColunms}
        dataSource={userDataList}
        rowKey={(record) => record.day}
      />
    </Layout>
  );
};

export default Page;

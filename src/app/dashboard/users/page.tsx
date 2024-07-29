"use client";
import { useState, useRef } from "react";
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Statistic,
  Table,
  Tabs,
  Typography,
} from "antd";
import { getUserCheckinData, getUserCreditData } from "@/services/points";
import { UserPointsDataType } from "@/constants/types.td";
import React from "react";
import Layout from "@/components/Layout";

const { Search } = Input;
const { Text } = Typography;

const Page: React.FC = () => {
  const [disabledStatus, setDisabledStatus] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [userDataList, setUserDataList] = useState<UserPointsDataType[]>([]);
  const timer = useRef<any>();
  const [tabKey, setTabKey] = useState<any>(0);
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
      title: "直接邀请奖励",
      dataIndex: "invite_credit_direct",
      key: "invite_credit_direct",
    },
    {
      title: "间接邀请奖励",
      dataIndex: "invite_credit_indirect",
      key: "invite_credit_indirect",
    },
    {
      title: "积分来源",
      dataIndex: "invite_key",
      key: "invite_key",
    },
    {
      title: "邀请地址",
      dataIndex: "invite_parent_wallet",
      key: "invite_parent_wallet",
    },
    {
      title: "被邀请地址",
      dataIndex: "invite_child_wallet",
      key: "invite_child_wallet",
    },
  ];

  const bindColumns = [
    {
      title: "日期",
      dataIndex: "day",
      key: "day",
    },
    {
      title: "绑定奖励",
      dataIndex: "bind_credit",
      key: "bind_credit",
    },
    {
      title: "关注奖励",
      dataIndex: "follow_credit",
      key: "follow_credit",
    },
    {
      title: "社交账号",
      dataIndex: "bind_what",
      key: "bind_what",
    },
    {
      title: "操作类型",
      dataIndex: "bind_way",
      key: "bind_way",
    },
    {
      title: "积分来源",
      dataIndex: "bind_key",
      key: "bind_key",
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
      setUserDataList(entity?.itmes);
      timer.current = window.setTimeout(() => {
        setDisabledStatus(false);
      }, 5000);
    } catch (e) {
      setDisabledStatus(false);
      console.error(e);
    }
  };

  const getCreditData = async (address?: string) => {
    try {
      setDisabledStatus(true);
      const res: any = await getUserCreditData({ wallet: address });
      const entity: any = res?.data;
      setSignCreadit(entity?.total_checkin_credit);
      setOauthCreadit(entity?.total_bind_credit);
      setInviteCreadit(entity?.total_invite_credit);
      setTotalCreadit(entity?.total_credit);
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
      getCreditData(values.address);
      setUserDataList([]);
    } catch (e) {}
  };

  const inputChange = (e: any) => {
    const value = e.target.value;
    setWallet("");
    setUserDataList([]);
    setTabKey(0);
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
  const gridStyle: React.CSSProperties = {
    width: "33%",
    textAlign: "center",
  };

  return (
    <Layout curActive="/dashboard/users">
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
            onChange={inputChange}
            disabled={disabledStatus}
            placeholder={"0x"}
          />
        </Form.Item>
      </Form>
      <Card title={`总积分：${totalCreadit}`} style={{ textAlign: "center" }}>
        <Card.Grid hoverable={false} style={gridStyle}>
          <Statistic title="累计签到积分" value={signCreadit} />
          {wallet && (
            <Button
              style={{ marginTop: 16 }}
              type="primary"
              onClick={() => tabChange(1)}
              disabled={disabledStatus}
            >
              查看详情
            </Button>
          )}
        </Card.Grid>
        <Card.Grid hoverable={false} style={gridStyle}>
          <Statistic title="累计邀请积分" value={inviteCreadit} />
          {wallet && (
            <Button
              style={{ marginTop: 16 }}
              type="primary"
              onClick={() => tabChange(2)}
              disabled={disabledStatus}
            >
              查看详情
            </Button>
          )}
        </Card.Grid>
        <Card.Grid hoverable={false} style={gridStyle}>
          <Statistic title="累计授权积分" value={oauthCreadit} />
          {wallet && (
            <Button
              style={{ marginTop: 16 }}
              type="primary"
              onClick={() => tabChange(3)}
              disabled={disabledStatus}
            >
              查看详情
            </Button>
          )}
        </Card.Grid>
      </Card>
      <br />
      {tabKey > 0 && (
        <Divider orientation="left">
          {tabKey == 1 ? "签到记录" : tabKey == 2 ? "邀请记录" : "授权记录"}
        </Divider>
      )}
      {tabKey > 0 && (
        <Table
          pagination={false}
          columns={currentColunms}
          dataSource={userDataList}
          rowKey={(record) => record.day}
        />
      )}
    </Layout>
  );
};

export default Page;

"use client";
import {
  Button,
  Col,
  Flex,
  Modal,
  Row,
  Space,
  Spin,
  Table,
  message,
} from "antd";
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import styles from "@/app/user/index.module.less";
import { getHotGameList, adultHot } from "@/services/hot";
import { uploadJson } from "@/services/points";
import { usePathname } from "next/navigation";
import { buttonPermission } from "@/utils";
import { CheckOutlined, LoadingOutlined } from "@ant-design/icons";

const Page: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [hotGameList, setHotGameList] = useState<any[]>([]);
  const [record, setRecord] = useState<any>();
  const [adultOpen, setAdultOpen] = useState<boolean>(false);

  const [isClient, setIsClient] = useState(false);
  const pathname: any = usePathname();

  const [isOpenLoading, setIsOpenLoading] = useState<boolean>(false);
  const [adultLoading, setAdultLoading] = useState<boolean>(false);
  const [imgLoading, setImgLoading] = useState<boolean>(false);
  const [jsonLoadding, setJsonLoadding] = useState<boolean>(false);
  const [listLoading, setListLoading] = useState<boolean>(false);

  const columns: any = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "游戏名称",
      dataIndex: "name",
      key: "name",
      width: 200,
    },
    {
      title: "Game Id",
      dataIndex: "game_id",
      key: "game_id",
    },
    {
      title: "封面",
      dataIndex: "cover_url",
      key: "cover_url",
      render: (txt: any) => {
        return (
          <img
            style={{ width: 200, height: 100, objectFit: "cover" }}
            src={txt}
          />
        );
      },
    },
    {
      title: "排序",
      dataIndex: "sequence",
      key: "sequence",
    },
    {
      title: "创建时间",
      dataIndex: "created_at",
      key: "created_at",
    },
    {
      title: "操作",
      key: "action",
      render: (_: any, record: any) => (
        <Space size="middle">
          {isClient && buttonPermission(pathname, 6) ? (
            <a
              onClick={() => {
                setRecord(record);
                setAdultOpen(true);
              }}
            >
              审核
            </a>
          ) : null}
        </Space>
      ),
    },
  ];

  const getAllHotGames = async () => {
    try {
      setLoading(true);
      const res = await getHotGameList({ review_status: 2 });
      setHotGameList(res?.data);
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsClient(true);
    getAllHotGames();
  }, []);

  const style: React.CSSProperties = {
    padding: "8px 4px",
  };

  const handleAdultSave = async () => {
    try {
      setAdultOpen(false);
      setIsOpenLoading(true);
      setAdultLoading(true);
      setJsonLoadding(true);
      setImgLoading(true);
      setListLoading(true);
      const result: any = await adultHot({
        id: record?.id,
        review_status: 3,
      });
      if (result?.data?.code === 0) {
        setAdultOpen(false);
        setAdultLoading(false);
        await uploadJson();
        setJsonLoadding(false);
        await getAllHotGames();
        setListLoading(false);
        setIsOpenLoading(false);
        message.success("提交成功");
      }
    } catch (error) {
      setAdultOpen(false);
      setIsOpenLoading(false);
    }
  };

  const handleAdultReject = async () => {
    try {
      setAdultOpen(false);
      const result: any = await adultHot({
        id: record?.id,
        review_status: 4,
      });
      if (result?.data?.code === 0) {
        getAllHotGames();
        message.success("提交成功");
      }
      setAdultOpen(false);
    } catch (error) {
      setAdultOpen(false);
    }
  };
  const handleAdultCancle = () => {
    setAdultOpen(false);
  };

  return (
    <Layout curActive="/marketing/hot">
      <br />
      <Table
        loading={loading}
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={hotGameList}
        pagination={false}
      />
      <Modal
        title="审核"
        width={500}
        open={adultOpen}
        onCancel={handleAdultCancle}
        footer={[
          <Button key={1} onClick={handleAdultCancle}>
            取消
          </Button>,
          <Button key={2} onClick={handleAdultSave}>
            审核通过
          </Button>,
          <Button key={3} type="primary" onClick={handleAdultReject}>
            审核拒绝
          </Button>,
        ]}
      >
        <Row gutter={24}>
          <Col className="gutter-row" span={24}>
            <div style={style}>游戏名称：{record?.name}</div>
          </Col>
        </Row>
      </Modal>
      <Modal
        title="审核中"
        width={400}
        open={isOpenLoading}
        footer={[]}
        onCancel={() => setIsOpenLoading(false)}
      >
        <Row gutter={24}>
          <Col span={24} style={{ padding: "10px 0" }}>
            <Flex align="center" justify="center" gap="middle">
              状态审核中：
              <Spin
                indicator={
                  adultLoading ? <LoadingOutlined spin /> : <CheckOutlined />
                }
                size="small"
              />
            </Flex>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={24} style={{ padding: "10px 0" }}>
            <Flex align="center" justify="center" gap="middle">
              正在同步数据：
              <Spin
                indicator={
                  jsonLoadding ? <LoadingOutlined spin /> : <CheckOutlined />
                }
                size="small"
              />
            </Flex>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={24} style={{ padding: "10px 0" }}>
            <Flex align="center" justify="center" gap="middle">
              正在刷新列表：
              <Spin
                indicator={
                  listLoading ? <LoadingOutlined spin /> : <CheckOutlined />
                }
                size="small"
              />
            </Flex>
          </Col>
        </Row>
      </Modal>
    </Layout>
  );
};

export default Page;

"use client";
import { Button, Col, Modal, Row, Space, Table, message } from "antd";
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import styles from "@/app/user/index.module.less";
import { getHotGameList, adultHot } from "@/services/hot";
import { uploadJson } from "@/services/points";

const Page: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [hotGameList, setHotGameList] = useState<any[]>([]);
  const [record, setRecord] = useState<any>();
  const [adultOpen, setAdultOpen] = useState<boolean>(false);

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
          <a
            onClick={() => {
              setRecord(record);
              setAdultOpen(true);
            }}
          >
            审核
          </a>
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
    getAllHotGames();
  }, []);

  const style: React.CSSProperties = {
    padding: "8px 4px",
  };

  const handleAdultSave = async () => {
    try {
      setAdultOpen(false);
      const result: any = await adultHot({
        id: record?.id,
        review_status: 3,
      });
      if (result?.data?.code === 0) {
        setAdultOpen(false);
        getAllHotGames();
        uploadJson();
        message.success("提交成功");
      }
    } catch (error) {
      setAdultOpen(false);
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
          <Button onClick={handleAdultCancle}>取消</Button>,
          <Button onClick={handleAdultSave}>审核通过</Button>,
          <Button type="primary" onClick={handleAdultReject}>
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
    </Layout>
  );
};

export default Page;

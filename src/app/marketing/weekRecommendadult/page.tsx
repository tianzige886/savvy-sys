"use client";
import { Button, Col, Modal, Row, Space, Table, message } from "antd";
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import styles from "@/app/user/index.module.less";
import {
  getWeekRecommendGameList,
  adultWeekRecommend,
  awsWeekRecommend,
} from "@/services/weekRecommend";
import { getGameListByIds } from "@/services/game";
import { uploadJson } from "@/services/points";

const Page: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [recommendGameList, setRecommendGameList] = useState<any[]>([]);
  const [record, setRecord] = useState<any>();
  const [adultOpen, setAdultOpen] = useState<boolean>(false);
  const [gameList, setGameList] = useState<any[]>([]);

  const columns: any = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "封面",
      dataIndex: "cover_url",
      key: "cover_url",
      render: (txt: any) => {
        return (
          <img
            style={{ width: 300, height: 150, objectFit: "cover" }}
            src={txt}
          />
        );
      },
    },
    {
      title: "关联游戏列表",
      dataIndex: "game_ids",
      key: "game_ids",
      render: (txt: any, record: any) => {
        const games = txt.split(",");
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {games?.map((item: any, index: any) => {
              return (
                <a key={item} href={"https://baidu.com?id=" + item}>
                  {"https://baidu.com?id=" + item}
                </a>
              );
            })}
          </div>
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
              searchGameByIds(record?.game_ids);
            }}
          >
            审核
          </a>
        </Space>
      ),
    },
  ];

  const searchGameByIds = async (ids: string) => {
    if (!ids) return;
    try {
      const res: any = await getGameListByIds({
        ids,
      });
      if (res?.code === 0) {
        const arr = ids.split(",");
        const list = res?.data;
        const currents = list.filter((item: any) =>
          arr.includes(String(item.id))
        );
        setGameList(currents);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getAllRecommendGames = async () => {
    try {
      setLoading(true);
      const res = await getWeekRecommendGameList({ review_status: 2 });
      console.log("res");
      console.log(res);
      setRecommendGameList(res?.data);
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllRecommendGames();
  }, []);

  const style: React.CSSProperties = {
    padding: "8px 4px",
  };

  const handleAdultSave = async () => {
    try {
      setAdultOpen(false);
      const result: any = await adultWeekRecommend({
        id: record?.id,
        review_status: 3,
      });
      if (result?.data?.code === 0) {
        setAdultOpen(false);
        getAllRecommendGames();
        uploadJson();
        awsWeekRecommend({
          commondId: record?.id,
        });
        message.success("提交成功");
      }
    } catch (error) {
      setAdultOpen(false);
    }
  };

  const handleAdultReject = async () => {
    try {
      setAdultOpen(false);
      const result: any = await adultWeekRecommend({
        id: record?.id,
        review_status: 4,
      });
      if (result?.data?.code === 0) {
        getAllRecommendGames();
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
    <Layout curActive="/marketing/weekRecommend">
      <br />
      <Table
        loading={loading}
        columns={columns}
        rowKey={"id"}
        dataSource={recommendGameList}
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
            <div style={style}>
              游戏名称：
              {gameList.length > 0 &&
                gameList.map((item: any, idx: any) => (
                  <span
                    style={{
                      marginLeft: "10px",
                    }}
                    key={idx}
                  >
                    {item.name},
                  </span>
                ))}
            </div>
          </Col>
          <Col className="gutter-row" span={24}>
            <div style={style}>游戏封面：</div>
            <div style={style}>
              <img src={record?.cover_url} alt="" style={{ width: "100%" }} />
            </div>
          </Col>
        </Row>
      </Modal>
    </Layout>
  );
};

export default Page;

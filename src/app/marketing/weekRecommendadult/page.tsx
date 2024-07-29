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
import {
  getWeekRecommendGameList,
  adultWeekRecommend,
  awsWeekRecommend,
} from "@/services/weekRecommend";
import { getGameListByIds } from "@/services/game";
import { uploadJson } from "@/services/points";
import { usePathname } from "next/navigation";
import { buttonPermission } from "@/utils";
import { CheckOutlined, LoadingOutlined } from "@ant-design/icons";

const Page: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [recommendGameList, setRecommendGameList] = useState<any[]>([]);
  const [record, setRecord] = useState<any>();
  const [adultOpen, setAdultOpen] = useState<boolean>(false);
  const [gameList, setGameList] = useState<any[]>([]);

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
          {isClient && buttonPermission(pathname, 6) ? (
            <a
              onClick={() => {
                setRecord(record);
                setAdultOpen(true);
                searchGameByIds(record?.game_ids);
              }}
            >
              审核
            </a>
          ) : null}
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
    setIsClient(true);
    getAllRecommendGames();
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
      const result: any = await adultWeekRecommend({
        id: record?.id,
        review_status: 3,
      });
      if (result?.data?.code === 0) {
        setAdultOpen(false);
        setAdultLoading(false);
        await awsWeekRecommend({
          commondId: record?.id,
        });
        setImgLoading(false);
        await uploadJson();
        setJsonLoadding(false);
        await getAllRecommendGames();
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
              正在更新图片：
              <Spin
                indicator={
                  imgLoading ? <LoadingOutlined spin /> : <CheckOutlined />
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

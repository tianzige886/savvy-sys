"use client";
import {
  Button,
  Row,
  Col,
  Form,
  Input,
  Modal,
  Space,
  Table,
  message,
  Spin,
  Flex,
} from "antd";
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useRouter } from "next/navigation";
import { adultGame, getGameList } from "@/services/game";
import styles from "@/app/user/index.module.less";
import adult from "pages/api/game/adult";
import { uploadJson, uploadAwsByNames } from "@/services/points";
import { buttonPermission } from "@/utils";
import { usePathname } from "next/navigation";
import { CheckOutlined, LoadingOutlined } from "@ant-design/icons";

const Page: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const pageSize: number = 20;
  const [dataRecord, setDataRecord] = useState<any>({});
  const [adultOpen, setAdultOpen] = useState<boolean>(false);
  const [isClient, setIsClient] = useState(false);

  const pathname: any = usePathname();

  const [isOpenLoading, setIsOpenLoading] = useState<boolean>(false);
  const [adultLoading, setAdultLoading] = useState<boolean>(false);
  const [imgLoading, setImgLoading] = useState<boolean>(false);
  const [jsonLoadding, setJsonLoadding] = useState<boolean>(false);
  const [listLoading, setListLoading] = useState<boolean>(false);

  // review_status: 1 待审核, 2 审核中，3 已上架， 4 审核失败， 5 已下架
  const reviewStatusText: any = {
    1: "待审核",
    2: "审核中",
    3: "已上架",
    4: "审核失败",
    5: "已下架",
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  const columns: any = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "name",
      dataIndex: "name",
      key: "name",
      width: 150,
    },

    {
      title: "封面",
      dataIndex: "cover_url",
      key: "cover_url",
      render: (txt: any) => {
        return (
          <img
            style={{ width: 150, height: 100, objectFit: "cover" }}
            src={txt}
          />
        );
      },
    },
    {
      title: "platform",
      dataIndex: "platform",
      key: "platform",
    },
    {
      title: "size",
      dataIndex: "size",
      key: "size",
    },
    {
      title: "logo",
      dataIndex: "logo",
      key: "logo",
      render: (txt: any) => {
        return (
          <img
            style={{ width: 50, height: 50, objectFit: "cover" }}
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
      width: 200,
    },
    {
      title: "审核状态",
      dataIndex: "review_status",
      key: "review_status",
      render: (txt: any) => {
        return <span>{reviewStatusText[txt] || "待审核"}</span>;
      },
    },
    {
      title: "操作",
      key: "action",
      render: (_: any, record: any) => (
        <Space size="middle">
          {isClient && buttonPermission(pathname, 6) ? (
            <a onClick={() => openAdultGame(record)}>审核</a>
          ) : null}
        </Space>
      ),
    },
  ];

  const openAdultGame = (record: any) => {
    const entity: any = { ...record };
    const picturesList: any = [];

    // const pics = JSON.parse(entity?.pictures || []);
    // for (let i = 0; i < pics.length; i++) {
    //   if (pics[i]) {
    //     picturesList.push(pics[i]);
    //   }
    // }
    entity.picturesList = picturesList;

    setDataRecord(entity);
    setAdultOpen(true);
  };

  const handleAdultSave = async () => {
    try {
      setAdultOpen(false);
      setIsOpenLoading(true);
      setAdultLoading(true);
      setJsonLoadding(true);
      setImgLoading(true);
      setListLoading(true);

      const result: any = await adultGame({
        id: dataRecord?.id,
        review_status: 3,
      });
      if (result?.data?.code === 0) {
        setAdultOpen(false);
        setAdultLoading(false);
        await uploadAwsByNames({ gameId: dataRecord?.id });
        setImgLoading(false);
        await uploadJson();
        setJsonLoadding(false);
        await getData();
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
      const result: any = await adultGame({
        id: dataRecord?.id,
        review_status: 4,
      });
      if (result?.data?.code === 0) {
        getData();
        message.success("提交成功");
      }
      setAdultOpen(false);
    } catch (error) {
      setAdultOpen(false);
    }
  };

  const getData = async () => {
    try {
      setLoading(true);
      const res: any = await getGameList({
        pageNumber,
        pageSize,
        review_status: 2,
      });
      if (res?.code === 0) {
        setData(res?.data?.list);
        setTotal(res?.data?.totalCount);
      }
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };
  const changePage = (current: number) => {
    setPageNumber(current);
  };

  useEffect(() => {
    if (pageNumber) getData();
  }, [pageNumber]);

  useEffect(() => {
    getData();
  }, []);

  const handleAdultCancle = () => {
    setAdultOpen(false);
  };

  const style: React.CSSProperties = {
    padding: "8px 4px",
  };

  const uploadAws = async () => {
    const res: any = await uploadAwsByNames({
      gameId: 36,
    });
    console.log("*************", res);
  };

  return (
    <Layout curActive="/games/list">
      {/* <Button onClick={uploadAws}>上传</Button> */}
      <br />
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record) => record.id}
        pagination={{
          showQuickJumper: false,
          showTotal: () => `共${total}条`,
          pageSize: pageSize,
          total: total, //数据的总的条数
          onChange: (current) => changePage(current), //点击当前页码
        }}
      />
      <Modal
        title="审核"
        width={1100}
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
          <Col className="gutter-row" span={6}>
            <div style={style}>游戏名称：{dataRecord.name}</div>
          </Col>
          <Col className="gutter-row" span={6}>
            <div style={style}>Networks：{dataRecord.networks}</div>
          </Col>
          <Col className="gutter-row" span={6}>
            <div style={style}>语言：{dataRecord.languages}</div>
          </Col>
          <Col className="gutter-row" span={6}>
            <div style={style}>Token：{dataRecord.token_name}</div>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col className="gutter-row" span={6}>
            <div style={style}>Platforms：{dataRecord.platform_name}</div>
          </Col>
          <Col className="gutter-row" span={6}>
            <div style={style}>size：{dataRecord.size}</div>
          </Col>
          <Col className="gutter-row" span={6}>
            <div style={style}>Website：{dataRecord.website}</div>
          </Col>
          <Col className="gutter-row" span={6}>
            <div style={style}>Media：{dataRecord.media}</div>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col className="gutter-row" span={6}>
            <div style={style}>游戏介绍：{dataRecord.introduction}</div>
          </Col>
          <Col className="gutter-row" span={6}>
            <div style={style}>简短介绍：{dataRecord.short_introduction}</div>
          </Col>
          <Col className="gutter-row" span={6}>
            <div style={style}>游戏标签：{dataRecord.tags}</div>
          </Col>
          <Col className="gutter-row" span={6}>
            <div style={style}>游戏玩法：{dataRecord.gameplay_description}</div>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col className="gutter-row" span={6}>
            <div style={style}>游戏玩法图片/视频：</div>
            <div style={style}>
              <img
                src={dataRecord.gameplay_show}
                alt=""
                style={{ width: "100%" }}
              />
            </div>
          </Col>
          <Col className="gutter-row" span={6}>
            <div style={style}>Logo：</div>
            <div style={style}>
              <img src={dataRecord.logo} alt="" style={{ width: "100%" }} />
            </div>
          </Col>
          <Col className="gutter-row" span={6}>
            <div style={style}>图片&视频信息：</div>
            <div style={style}>
              {dataRecord?.picturesList?.length > 0 &&
                dataRecord?.picturesList.map(
                  (p: any, index: any) =>
                    p && (
                      <img
                        src={p}
                        alt=""
                        style={{ width: "100%" }}
                        key={index}
                      />
                    )
                )}
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

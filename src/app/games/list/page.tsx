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
  Flex,
  Spin,
} from "antd";
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { usePathname, useRouter } from "next/navigation";
import { getGameList, adultGame } from "@/services/game";
import styles from "@/app/user/index.module.less";
import PermitButton from "@/components/button";
import { buttonPermission } from "@/utils";
import { uploadJson } from "@/services/points";
import { CheckOutlined, LoadingOutlined } from "@ant-design/icons";

const Page: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const pageSize: number = 20;
  const pathname: any = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [downOpen, setDwonOpen] = useState(false);
  const [downLoading, setDownLoading] = useState(false);
  const [dataRecord, setDataRecord] = useState<any>({});

  const [isOpenLoading, setIsOpenLoading] = useState<boolean>(false);
  const [adultLoading, setAdultLoading] = useState<boolean>(false);
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
      render: (txt: string) => {
        return (
          <img
            style={{ width: 200, height: 100, objectFit: "cover" }}
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
      render: (txt: string) => {
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
    },
    {
      title: "状态",
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
          {record.review_status !== 3 &&
            isClient &&
            buttonPermission(pathname, 4) && (
              <a
                onClick={() => {
                  router.push("/games/createAndEdit?id=" + record?.id);
                }}
              >
                编辑
              </a>
            )}
          {record.review_status === 3 &&
            isClient &&
            buttonPermission(pathname, 8) && (
              <a onClick={() => undercarriage(record)}>下架</a>
            )}
          {(record.review_status === 1 ||
            record.review_status === 4 ||
            record.review_status === 5) &&
            isClient &&
            buttonPermission(pathname, 7) && (
              <a
                onClick={() => {
                  adultGame({ id: record?.id, review_status: 2 }).then(
                    (res: any) => {
                      if (res?.data?.code === 0) {
                        getData();
                        message.success("提交成功");
                      }
                    }
                  );
                }}
              >
                提交审核
              </a>
            )}
          {/*<a*/}
          {/*  className={styles.error}*/}
          {/*  onClick={() => {*/}
          {/*    !deleteLoading && deleteRecommendFunc(record?.id);*/}
          {/*  }}*/}
          {/*>*/}
          {/*  删除*/}
          {/*</a>*/}
        </Space>
      ),
    },
  ];

  const undercarriage = (record: any) => {
    setDwonOpen(true);
    setDataRecord(record);
  };

  const handleCancel = () => {
    setDwonOpen(false);
  };
  // review_status: 1 待审核, 2 审核中，3 已上架， 4 审核失败， 5 已下架
  const handleOk = async () => {
    try {
      setDwonOpen(false);

      setIsOpenLoading(true);
      setAdultLoading(true);
      setJsonLoadding(true);
      setListLoading(true);
      const result: any = await adultGame({
        id: dataRecord?.id,
        review_status: 5,
      });
      setDwonOpen(false);
      setAdultLoading(false);
      if (result?.data?.code === 0) {
        await uploadJson();
        setJsonLoadding(false);
        await getData();
        setListLoading(false);
        setIsOpenLoading(false);
        message.success("下架成功");
      }
    } catch (error) {
      setDwonOpen(false);
      setIsOpenLoading(false);
      message.error("下架失败");
    }
  };

  const getData = async () => {
    try {
      setLoading(true);
      const res: any = await getGameList({ pageNumber, pageSize });
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
    setIsClient(true);
    getData();
  }, []);

  return (
    <Layout curActive="/games/list">
      <Form form={form}>
        <Row gutter={24}>
          <Col span={4}>
            <PermitButton
              onClick={() => router.push("/games/createAndEdit")}
              type={"primary"}
              path={pathname}
              permit={2}
            >
              新增
            </PermitButton>
          </Col>
        </Row>
      </Form>
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
        title="下架游戏"
        open={downOpen}
        onCancel={handleCancel}
        footer={[
          <Button key={1} onClick={handleCancel}>
            取消
          </Button>,
          <Button
            key={2}
            type="primary"
            loading={downLoading}
            onClick={handleOk}
          >
            下架
          </Button>,
        ]}
      >
        <p>确定要下架当前游戏？</p>
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

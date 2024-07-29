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
} from "antd";
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useRouter } from "next/navigation";
import { getGameList, adultGame } from "@/services/game";
import styles from "@/app/user/index.module.less";

const Page: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const pageSize: number = 20;

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
      render: (txt) => {
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
      render: (txt) => {
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
          <a
            onClick={() => {
              router.push("/games/createAndEdit?id=" + record?.id);
            }}
          >
            编辑
          </a>
          {(record.review_status === 1 || record.review_status === 4) && (
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

  const getData = async () => {
    try {
      setLoading(true);
      const res = await getGameList({ pageNumber, pageSize });
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

  return (
    <Layout curActive="/games/list">
      <Form form={form}>
        <Row gutter={24}>
          <Col span={4}>
            <Button
              onClick={() => router.push("/games/createAndEdit")}
              type={"primary"}
            >
              新增
            </Button>
          </Col>
        </Row>
      </Form>
      <br />
      <Table
        columns={columns}
        dataSource={data}
        pagination={{
          showQuickJumper: false,
          showTotal: () => `共${total}条`,
          pageSize: pageSize,
          total: total, //数据的总的条数
          onChange: (current) => changePage(current), //点击当前页码
        }}
      />
    </Layout>
  );
};

export default Page;

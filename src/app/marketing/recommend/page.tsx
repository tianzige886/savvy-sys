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
  Select,
  message,
  Flex,
  Spin,
} from "antd";
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import styles from "@/app/user/index.module.less";
import { getGameList } from "@/services/game";
import {
  createRecommend,
  getRecommendGameList,
  updateRecommend,
  deleteRecommend,
  adultRecommend,
} from "@/services/recommend";
import debounce from "lodash/debounce";
import { usePathname } from "next/navigation";
import { uploadJson } from "@/services/points";
import { CheckOutlined, LoadingOutlined } from "@ant-design/icons";
import PermitButton from "@/components/button";
import { buttonPermission } from "@/utils";

const Page: React.FC = () => {
  const [createForm] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [recommendGameList, setRecommendGameList] = useState<any[]>([]);
  const [gameList, setGameList] = useState<any[]>([]);
  const [record, setRecord] = useState<any>();

  const [isClient, setIsClient] = useState(false);
  const pathname: any = usePathname();

  const [downOpen, setDwonOpen] = useState(false);
  const [downLoading, setDownLoading] = useState(false);

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
          {record.review_status !== 3 &&
            isClient &&
            buttonPermission(pathname, 4) && (
              <a
                onClick={() => {
                  setRecord(record);
                  setOpen(true);
                  initForm(record);
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
                  adultRecommend({ id: record?.id, review_status: 2 }).then(
                    (res: any) => {
                      if (res?.data?.code === 0) {
                        getAllRecommendGames();
                        message.success("提交成功");
                      }
                    }
                  );
                }}
              >
                提交审核
              </a>
            )}
          {record.review_status !== 3 &&
            isClient &&
            buttonPermission(pathname, 3) && (
              <a
                className={styles.error}
                onClick={() => {
                  !deleteLoading && deleteRecommendFunc(record?.id);
                }}
              >
                删除
              </a>
            )}
        </Space>
      ),
    },
  ];

  const undercarriage = (record: any) => {
    setDwonOpen(true);
    setRecord(record);
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
      const result: any = await adultRecommend({
        id: record?.id,
        review_status: 5,
      });
      setDwonOpen(false);
      setAdultLoading(false);
      if (result?.data?.code === 0) {
        await uploadJson();
        setJsonLoadding(false);
        await getAllRecommendGames();
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

  const getAllRecommendGames = async () => {
    try {
      setLoading(true);
      const res: any = await getRecommendGameList({});
      setRecommendGameList(res?.data);
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  const initForm = (rcd: any) => {
    searchGame(rcd?.name);
    createForm.setFieldsValue({
      game_id: rcd?.game_id,
      sequence: rcd?.sequence,
    });
  };

  useEffect(() => {
    setIsClient(true);
    getAllRecommendGames();
  }, []);

  const searchGame = async (keyword: string) => {
    if (!keyword) return;
    try {
      const res: any = await getGameList({
        pageNumber: 1,
        pageSize: 10000,
        keyword,
        review_status: 3,
      });
      if (res?.code === 0) {
        const list = res?.data?.list;
        setGameList(list);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const debounceFetcher = debounce(searchGame, 1000);
  const onSearchGame = (value: string) => {
    debounceFetcher(value);
  };

  const createSubmit = async (values: any) => {
    try {
      setButtonLoading(true);
      if (record?.id) {
        const res: any = await updateRecommend({
          id: record?.id,
          game_id: Number(values?.game_id),
          sequence: Number(values?.sequence),
        });
        if (res?.code === 0) {
          setButtonLoading(false);
          alert("Updated");
          window.setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      } else {
        const res: any = await createRecommend({
          game_id: Number(values?.game_id),
          sequence: Number(values?.sequence),
        });
        if (res?.code === 0) {
          setButtonLoading(false);
          alert("Success");
          window.setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      }
    } catch (e) {
      setButtonLoading(false);
    }
  };

  const deleteRecommendFunc = async (id: any) => {
    try {
      setDeleteLoading(true);
      const res: any = await deleteRecommend({
        id: Number(id),
      });
      if (res?.code === 0) {
        setDeleteLoading(false);
        alert("Deleted");
        window.setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (e) {
      setDeleteLoading(false);
    }
  };

  return (
    <Layout curActive="/marketing/recommend">
      <Row gutter={24}>
        <Col span={4}>
          <PermitButton
            onClick={() => setOpen(true)}
            type={"primary"}
            path={pathname}
            permit={2}
          >
            新增
          </PermitButton>
        </Col>
      </Row>
      <br />
      <Table
        loading={loading}
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={recommendGameList}
        pagination={false}
      />
      {open && (
        <Modal
          title={record?.id ? "编辑" : "新增"}
          okButtonProps={{ loading: buttonLoading }}
          open={open}
          onOk={() => createForm.submit()}
          onCancel={() => {
            setRecord(null);
            setOpen(false);
            createForm.resetFields();
          }}
        >
          <Form form={createForm} onFinish={(values) => createSubmit(values)}>
            <Form.Item
              rules={[{ required: true }]}
              name={"game_id"}
              label={"请选择游戏"}
            >
              <Select
                placeholder={"搜索游戏"}
                style={{ width: "100%" }}
                showSearch={true}
                filterOption={false}
                onSearch={(value) => onSearchGame(value)}
                options={gameList.map((item) => {
                  return {
                    value: item.id,
                    label: item.name,
                  };
                })}
              />
            </Form.Item>
            <Form.Item name={"sequence"} label={"排序"}>
              <Input placeholder={"请输入数字"} />
            </Form.Item>
          </Form>
        </Modal>
      )}
      <Modal
        title="下架"
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

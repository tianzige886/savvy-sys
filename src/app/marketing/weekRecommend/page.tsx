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
  Upload,
  message,
} from "antd";
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import styles from "@/app/user/index.module.less";
import { getGameList, getGameListByIds } from "@/services/game";
import {
  createOne,
  getWeekRecommendGameList,
  updateOne,
  deleteOne,
  adultWeekRecommend,
} from "@/services/weekRecommend";
import debounce from "lodash/debounce";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

const Page: React.FC = () => {
  const [createForm] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [recommendGameList, setRecommendGameList] = useState<any[]>([]);
  const [gameList, setGameList] = useState<any[]>([]);
  const [record, setRecord] = useState<any>();
  const [coverLoading, setCoverLoading] = useState<boolean>(false);
  const [cover, setCover] = useState<string>("");

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
      title: "关联游戏列表",
      dataIndex: "game_ids",
      key: "game_ids",
      render: (txt: any) => {
        const games = txt.split(",");
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {games?.map((item: any, index: number) => {
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
          <a
            onClick={() => {
              setRecord(record);
              setOpen(true);
              initForm(record);
            }}
          >
            编辑
          </a>
          <a
            className={styles.error}
            onClick={() => {
              !deleteLoading && deleteRecommendFunc(record?.id);
            }}
          >
            删除
          </a>
          {(record.review_status === 1 || record.review_status === 4) && (
            <a
              onClick={() => {
                adultWeekRecommend({ id: record?.id, review_status: 2 }).then(
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
        </Space>
      ),
    },
  ];

  const getAllRecommendGames = async () => {
    try {
      setLoading(true);
      const res: any = await getWeekRecommendGameList({});
      console.log("res");
      console.log(res);
      setRecommendGameList(res?.data);
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  const initForm = (rcd: any) => {
    searchGameByIds(rcd?.game_ids);
    setCover(rcd?.cover_url);
    createForm.setFieldsValue({
      game_ids: rcd?.game_ids.split(",").map((item: any) => Number(item)),
      sequence: rcd?.sequence,
    });
  };

  useEffect(() => {
    getAllRecommendGames();
  }, []);

  const searchGameByIds = async (ids: string) => {
    if (!ids) return;
    try {
      const res: any = await getGameListByIds({
        ids,
      });
      if (res?.code === 0) {
        const list = res?.data;
        setGameList(list);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const searchGame = async (keyword: string) => {
    if (!keyword) return;
    try {
      const res: any = await getGameList({
        pageNumber: 1,
        pageSize: 10000,
        keyword,
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
      if (!cover) {
        alert("请上传封面");
        return false;
      }
      setButtonLoading(true);
      if (record?.id) {
        const res: any = await updateOne({
          id: record?.id,
          game_ids: values?.game_ids?.join(","),
          cover_url: cover,
        });
        if (res?.code === 0) {
          setButtonLoading(false);
          alert("Updated");
          window.setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      } else {
        const res: any = await createOne({
          game_ids: values?.game_ids?.join(","),
          cover_url: cover,
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
      const res: any = await deleteOne({
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

  const onPicChange: any = ({ fileList: newFileList, file }: any) => {
    if (file.status === "done") {
      const response = file.response;
      setCoverLoading(false);
      if (response?.code === 0) {
        // savePic(response?.data);
        setCover(response?.data);
      } else {
        alert("error, please retry.");
      }
    }
    if (newFileList?.[0]?.status == "uploading") {
      setCoverLoading(true);
    }
    // setFileList(newFileList);
  };

  return (
    <Layout curActive="/marketing/weekRecommend">
      <Row gutter={24}>
        <Col span={4}>
          <Button onClick={() => setOpen(true)} type={"primary"}>
            新增
          </Button>
        </Col>
      </Row>
      <br />
      <Table
        loading={loading}
        columns={columns}
        rowKey={"id"}
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
            setCover("");
            setOpen(false);
            createForm.resetFields();
          }}
        >
          <Form form={createForm} onFinish={(values) => createSubmit(values)}>
            <Form.Item
              rules={[{ required: true }]}
              name={"game_ids"}
              label={"请选择游戏"}
            >
              <Select
                mode={"multiple"}
                placeholder={"搜索游戏多选"}
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
            <Form.Item
              label={"封面"}
              rules={[{ required: true }]}
              name={"cover_url"}
            >
              {cover ? (
                <div
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 5,
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      padding: "3px 5px",
                      background: "rgba(0, 0, 0, 0.5)",
                      color: "#fff",
                      position: "absolute",
                      right: 10,
                      top: 10,
                    }}
                    onClick={() => setCover("")}
                  >
                    删除
                  </span>
                  <img src={cover} style={{ width: "100%", height: "100%" }} />
                </div>
              ) : (
                <Upload
                  action="/api/upload/image_local"
                  // listType="picture-card"
                  // fileList={fileList}
                  showUploadList={false}
                  name={"file"}
                  onChange={(file) => onPicChange(file)}
                >
                  {coverLoading ? (
                    <LoadingOutlined style={{ color: "gray", fontSize: 16 }} />
                  ) : (
                    <div
                      style={{
                        border: "1px solid rgba(0, 0, 0, 0.1)",
                        borderRadius: 10,
                        width: "100px",
                        height: "100px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <PlusOutlined
                        style={{ color: "rgba(0, 0, 0, 0.3)", fontSize: 36 }}
                      />
                    </div>
                  )}
                </Upload>
              )}
            </Form.Item>
            <Form.Item name={"sequence"} label={"排序"}>
              <Input placeholder={"请输入数字"} />
            </Form.Item>
          </Form>
        </Modal>
      )}
    </Layout>
  );
};

export default Page;

"use client";
import { Row, Col, Form, Input, Select, DatePicker, Button } from "antd";
import { Upload } from "antd";
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { Networks, Platforms, Tokens, Status, Languages } from "@/constants";
import { getTags } from "@/services/tags";
import { getGame, createGame, updateGame } from "@/services/game";
import { useSearchParams } from "next/navigation";
import dayjs from "dayjs";

const PicType = {
  gamePlayShow: "gamePlayShow",
  logo: "logo",
  pictures1: "pictures1",
  pictures2: "pictures2",
  pictures3: "pictures3",
  pictures4: "pictures4",
};

// const { Search } = Input;
const Page: React.FC = () => {
  const [form] = Form.useForm();
  const [logo, setLogo] = useState<string>("");
  const [gameplayShow, setGameplayShow] = useState<string>("");
  const [pictures1, setPictures1] = useState<string>("");
  const [pictures2, setPictures2] = useState<string>("");
  const [pictures3, setPictures3] = useState<string>("");
  const [pictures4, setPictures4] = useState<string>("");
  // const [loading, setLoading] = useState<boolean>(false);
  const [logoLoading, setLogoLoading] = useState<boolean>(false);
  const [gameplayShowLoading, setGameplayShowLoading] =
    useState<boolean>(false);
  const [pic1ShowLoading, setPic1Loading] = useState<boolean>(false);
  const [pic2ShowLoading, setPic2Loading] = useState<boolean>(false);
  const [pic3ShowLoading, setPic3Loading] = useState<boolean>(false);
  const [pic4ShowLoading, setPic4Loading] = useState<boolean>(false);
  const [tagList, setTagList] = useState<any[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [detail, setDetail] = useState<any>();
  const [gameId, setGameId] = useState<any>();

  const onFinish = async (values: any) => {
    try {
      const {
        status,
        networks,
        languages,
        platform,
        tags,
        token,
        release_time,
        ...rest
      } = values;
      // console.log(tags);
      const params = {
        id: gameId,
        tags: JSON.stringify(tags),
        networks: networks.join(","),
        languages: languages.join(","),
        status: status.split("-")[0],
        status_name: status.split("-")[1],
        token: token.split("-")[0],
        token_name: token.split("-")[1],
        platform: platform.split("-")[0],
        platform_name: platform.split("-")[1],
        release_time: new Date(release_time).getTime(),
        cover_url: pictures1,
        ...rest,
        logo,
        gameplay_show: gameplayShow,
        pictures: JSON.stringify([pictures1, pictures2, pictures3, pictures4]),
      };
      if (gameId) {
        const res = await updateGame(params);
        alert("update success");
        router.back();
      } else {
        const res = await createGame(params);
        alert("add success");
        router.back();
      }
    } catch (e) {}
  };

  useEffect(() => {
    getTagList();
    const id = searchParams?.get("id");
    id && setGameId(Number(id));
    if (id) {
      getDetail(id);
    }
  }, []);

  useEffect(() => {
    if (form && detail) {
      form.setFieldsValue({
        name: detail?.name,
        networks: detail?.networks?.split(","),
        languages: detail?.languages?.split(","),
        status: detail?.status + "-" + detail?.status_name,
        token: detail?.token + "-" + detail?.token_name,
        platform: detail?.platform,
        logo: detail?.logo,
        size: detail?.size,
        website: detail?.website,
        release_time: detail?.release_time && dayjs(detail?.release_time),
        media: detail?.media,
        introduction: detail?.introduction,
        short_introduction: detail?.short_introduction,
        gameplay_description: detail?.gameplay_description,
        tags: detail?.tags && JSON.parse(detail?.tags),
      });
    }
  }, [form, JSON.stringify(detail)]);

  const getDetail = async (id: string) => {
    try {
      const res: any = await getGame({ id: Number(id) });
      setDetail(res?.data);
      const d = res?.data;
      setLogo(d?.logo);
      setGameplayShow(d?.gameplay_show);
      const pics = (d?.pictures && JSON.parse(d?.pictures)) || [];
      pics?.map((item: any, index: number) => {
        if (index < pics?.length) {
          switch (index + 1) {
            case 1:
              setPictures1(item);
              break;
            case 2:
              setPictures2(item);
              break;
            case 3:
              setPictures3(item);
              break;
            case 4:
              setPictures4(item);
              break;
          }
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  const getTagList = async () => {
    try {
      const res: any = await getTags();
      if (res.code === 0) {
        setTagList(res?.list);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onPicChange: any = (
    { fileList: newFileList, file }: any,
    picType: string
  ) => {
    if (file.status === "done") {
      const response = file.response;
      switch (picType) {
        case PicType.logo:
          setLogoLoading(false);
          break;
        case PicType.gamePlayShow:
          setGameplayShowLoading(false);
          break;
        case PicType.pictures1:
          setPic1Loading(false);
          break;
        case PicType.pictures2:
          setPic2Loading(false);
          break;
        case PicType.pictures3:
          setPic3Loading(false);
          break;
        case PicType.pictures4:
          setPic4Loading(false);
          break;
      }
      if (response?.code === 0) {
        // savePic(response?.data);
        switch (picType) {
          case PicType.logo:
            setLogo(response?.data);
            break;
          case PicType.gamePlayShow:
            setGameplayShow(response?.data);
            break;
          case PicType.pictures1:
            setPictures1(response?.data);
            break;
          case PicType.pictures2:
            setPictures2(response?.data);
            break;
          case PicType.pictures3:
            setPictures3(response?.data);
            break;
          case PicType.pictures4:
            setPictures4(response?.data);
            break;
        }
      } else {
        alert("error, please retry.");
      }
    }
    if (newFileList?.[0]?.status == "uploading") {
      switch (picType) {
        case PicType.logo:
          setLogoLoading(true);
          break;
        case PicType.gamePlayShow:
          setGameplayShowLoading(true);
          break;
        case PicType.pictures1:
          setPic1Loading(true);
          break;
        case PicType.pictures2:
          setPic2Loading(true);
          break;
        case PicType.pictures3:
          setPic3Loading(true);
          break;
        case PicType.pictures4:
          setPic4Loading(true);
          break;
      }
    }
    // setFileList(newFileList);
  };

  const handleTagChange = (value: string[]) => {
    console.log(`selected ${value}`);
  };

  return (
    <Layout curActive="/games/list">
      <Form form={form} onFinish={(values) => onFinish(values)}>
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item
              label={"游戏名称"}
              name={"name"}
              rules={[{ required: true }]}
            >
              <Input placeholder={"请输入"} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label={"Networks"}
              name={"networks"}
              rules={[{ required: true }]}
            >
              <Select
                mode="multiple"
                allowClear
                placeholder={"请选择"}
                style={{ width: 120 }}
                options={Networks.map((item) => {
                  return {
                    value: `${item.chainId + "-" + item.chainName}`,
                    label: item.chainName,
                  };
                })}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label={"语言"} name={"languages"}>
              <Select
                mode="multiple"
                allowClear
                placeholder={"请选择"}
                style={{ width: 120 }}
                options={Languages.map((item) => {
                  return {
                    value: `${item.value + "-" + item.label}`,
                    label: item.label,
                  };
                })}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label={"Status"}
              name={"status"}
              rules={[{ required: true }]}
            >
              <Select
                placeholder={"请选择"}
                style={{ width: 120 }}
                options={Status.map((item) => {
                  return {
                    value: `${item.value + "-" + item.label}`,
                    label: item.label,
                  };
                })}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              label={"Token"}
              name={"token"}
              rules={[{ required: true }]}
            >
              <Select
                placeholder={"请选择"}
                style={{ width: 120 }}
                options={Tokens.map((item) => {
                  return {
                    value: `${item.value + "-" + item.label}`,
                    label: item.label,
                  };
                })}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={"Platforms"}
              name={"platform"}
              rules={[{ required: true }]}
            >
              <Select
                placeholder={"请选择"}
                style={{ width: 120 }}
                options={Platforms.map((item) => {
                  return {
                    value: `${item.value}-${item.label}`,
                    label: item.label,
                  };
                })}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={"size"}
              name={"size"}
              rules={[{ required: true }]}
            >
              <Input placeholder={"请输入"} />
            </Form.Item>
          </Col>
        </Row>
        {/* 媒体 */}
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              label={"Website"}
              name={"website"}
              rules={[{ required: true }]}
            >
              <Input placeholder={"请输入"} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={"Time"}
              name={"release_time"}
              rules={[{ required: true }]}
            >
              <DatePicker placeholder={"请选择时间"} onChange={() => {}} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={"Media"}
              name={"media"}
              rules={[{ required: true }]}
            >
              <Input placeholder={"请输入"} />
            </Form.Item>
          </Col>
        </Row>
        {/* 游戏介绍和简短介绍 */}
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item label={"游戏介绍"} name={"introduction"}>
              <Input.TextArea placeholder={"请输入"} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label={"简短介绍"} name={"short_introduction"}>
              <Input placeholder={"请输入"} />
            </Form.Item>
          </Col>
        </Row>
        {/* 游戏玩法 */}
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              rules={[{ required: true }]}
              label={"游戏玩法"}
              // name={"gameplay_show"}
            >
              {gameplayShow ? (
                <div
                  style={{
                    width: 300,
                    height: 150,
                    borderRadius: 15,
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
                    onClick={() => setGameplayShow("")}
                  >
                    删除
                  </span>
                  <img
                    src={gameplayShow}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              ) : (
                <Upload
                  action="/api/upload/image_local"
                  // listType="picture-card"
                  // fileList={fileList}
                  showUploadList={false}
                  name={"file"}
                  onChange={(file) => onPicChange(file, PicType.gamePlayShow)}
                >
                  {gameplayShowLoading ? (
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
          </Col>
          <Col span={12}>
            <Form.Item name={"gameplay_description"}>
              <Input.TextArea placeholder={"请输入内容"} />
            </Form.Item>
          </Col>
        </Row>
        {/* logo */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label={"logo"}
              rules={[{ required: true }]}
              name={"logo"}
            >
              {logo ? (
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
                    onClick={() => setLogo("")}
                  >
                    删除
                  </span>
                  <img src={logo} style={{ width: "100%", height: "100%" }} />
                </div>
              ) : (
                <Upload
                  action="/api/upload/image_local"
                  // listType="picture-card"
                  // fileList={fileList}
                  showUploadList={false}
                  name={"file"}
                  onChange={(file) => onPicChange(file, PicType.logo)}
                >
                  {logoLoading ? (
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
          </Col>
        </Row>
        <br />
        <h4>图片&视频信息</h4>
        <Row gutter={24}>
          <Col>
            {pictures1 ? (
              <div
                style={{
                  width: 300,
                  height: 150,
                  borderRadius: 15,
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
                  onClick={() => setPictures1("")}
                >
                  删除
                </span>
                <img
                  src={pictures1}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            ) : (
              <Upload
                action="/api/upload/image_local"
                // listType="picture-card"
                // fileList={fileList}
                showUploadList={false}
                name={"file"}
                onChange={(file) => onPicChange(file, PicType.pictures1)}
              >
                {pic1ShowLoading ? (
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
          </Col>
          <Col>
            {pictures2 ? (
              <div
                style={{
                  width: 300,
                  height: 150,
                  borderRadius: 15,
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
                  onClick={() => setPictures2("")}
                >
                  删除
                </span>
                <img
                  src={pictures2}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            ) : (
              <Upload
                action="/api/upload/image_local"
                // listType="picture-card"
                // fileList={fileList}
                showUploadList={false}
                name={"file"}
                onChange={(file) => onPicChange(file, PicType.pictures2)}
              >
                {pic2ShowLoading ? (
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
          </Col>
          <Col>
            {pictures3 ? (
              <div
                style={{
                  width: 300,
                  height: 150,
                  borderRadius: 15,
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
                  onClick={() => setPictures3("")}
                >
                  删除
                </span>
                <img
                  src={pictures3}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            ) : (
              <Upload
                action="/api/upload/image_local"
                // listType="picture-card"
                // fileList={fileList}
                showUploadList={false}
                name={"file"}
                onChange={(file) => onPicChange(file, PicType.pictures3)}
              >
                {pic3ShowLoading ? (
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
          </Col>
          <Col>
            {pictures4 ? (
              <div
                style={{
                  width: 300,
                  height: 150,
                  borderRadius: 15,
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
                  onClick={() => setPictures4("")}
                >
                  删除
                </span>
                <img
                  src={pictures4}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            ) : (
              <Upload
                action="/api/upload/image_local"
                // listType="picture-card"
                // fileList={fileList}
                showUploadList={false}
                name={"file"}
                onChange={(file) => onPicChange(file, PicType.pictures4)}
              >
                {pic4ShowLoading ? (
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
          </Col>
        </Row>
        <br />
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item label={"游戏标签"} name={"tags"}>
              <Select
                mode="multiple"
                allowClear
                style={{ width: "100%" }}
                placeholder="请选择标签"
                onChange={handleTagChange}
                options={tagList.map((item) => {
                  return {
                    value: item?.id + "-" + item?.name,
                    label: item?.name,
                  };
                })}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24} justify={"end"}>
          <Col>
            <Button type={"default"}>取消</Button>
            &nbsp;&nbsp;
            <Button type={"primary"} onClick={() => form.submit()}>
              确认
            </Button>
          </Col>
        </Row>
      </Form>
    </Layout>
  );
};

export default Page;

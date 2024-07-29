"use client";
import { useState, useRef, useEffect } from "react";
import {
  Button,
  Checkbox,
  CheckboxProps,
  Divider,
  Form,
  GetProp,
  Input,
  Modal,
  Row,
  Space,
  Spin,
  Table,
  Upload,
  UploadFile,
  UploadProps,
  message,
} from "antd";
import {
  addUserPermissions,
  deleteUserById,
  getPermissionList,
  getUserList,
  getUserPermits,
  uploadImage,
  uploadJson,
} from "@/services/points";
import { UserPointsDataType } from "@/constants/types.td";
import React from "react";
import Layout from "@/components/Layout";
import styles from "../index.module.less";
import { buttonPermission } from "@/utils";
import { usePathname } from "next/navigation";

const { Search } = Input;
const Page: React.FC = () => {
  const [disabledStatus, setDisabledStatus] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [userDataList, setUserDataList] = useState<UserPointsDataType[]>([]);
  const [userName, setUserName] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>({});
  const [userPermissions, setUserPermissions] = useState<any[]>([]);
  const [permitOpen, setPermitOpen] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const [checkOptions, setCheckOptions] = useState<any>({});

  const pathname: any = usePathname();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const user = window.localStorage.getItem("balance_sys_user");
    if (user) {
      setUserInfo(JSON.parse(user));
    }
  }, []);

  const onChange = (item: any, button: any) => {
    const list = [...checkOptions];
    list.forEach((permit: any) => {
      if (item.id === permit.id) {
        permit.plainOptions.forEach((b: any) => {
          if (button.value === b.value) {
            b.checked = !b.checked;
          }
        });
        const checked = permit.plainOptions.some((b: any) => b.checked);
        permit.checked = checked;
      }
    });
    setCheckOptions(list);
  };

  const onCheckAllChange = (item: any) => {
    const list = [...checkOptions];
    list.forEach((permit: any) => {
      if (item.id === permit.id) {
        item.checked = !item.checked;
        permit.plainOptions.forEach((button: any) => {
          button.checked = item.checked;
        });
      }
    });
    setCheckOptions(list);
  };

  const operateOptions = (list: any, permits: any) => {
    const options: any[] = [];
    list.forEach((menu: any) => {
      const object: any = {};
      let butns = menu.buttons;
      object.plainOptions = butns.map((item: any) => {
        return {
          value: item.id,
          label: item.name,
          checked: permits.some(
            (p: any) => p.menu_id == menu.id && item.id == p.button_id
          ),
        };
      });
      object.defaultCheckedList = [];
      object.checked = permits.some((p: any) => p.menu_id == menu.id);
      object.indeterminate = [];
      object.checkList = [];
      object.id = menu.id;
      object.label = menu.label;
      object.name = menu.name;

      options.push(object);
    });
    return options;
  };

  const getPermis = async (record: any) => {
    try {
      setLoading(true);
      const res: any = await getPermissionList();
      const permitRes: any = await getUserPermits(record.id);
      const list: any[] = res?.data?.list || [];
      const permits: any[] = permitRes?.data?.list || [];

      const options = operateOptions(list, permits);
      setCheckOptions(options);
      setUserPermissions(list);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.error(e);
    }
  };

  const columns: any = [
    {
      title: "用户ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
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
          {isClient && buttonPermission(pathname, 4) ? (
            <a onClick={() => editPermission(record)}>编辑权限</a>
          ) : null}
          {isClient && buttonPermission(pathname, 3) ? (
            <a className={styles.error} onClick={() => deleteUser(record)}>
              删除
            </a>
          ) : null}
        </Space>
      ),
    },
  ];

  const getUserData = async (userName?: string) => {
    try {
      setDisabledStatus(true);
      const res: any = await getUserList({ username: userName });
      setDisabledStatus(false);
      const list: any = res?.data?.list;
      setUserDataList(list);
    } catch (e) {
      setDisabledStatus(false);
      console.error(e);
    }
  };

  const editPermission = (record: any) => {
    setCurrentUser(record);
    setPermitOpen(true);
    getPermis(record);
  };

  const deleteUser = (record: any) => {
    setCurrentUser(record);
    setOpen(true);
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      const res: any = await deleteUserById(currentUser.id);
      if (res.data.code === 0) {
        message.success("删除成功");
        getUserData();
      }
      setDeleteLoading(false);
      setOpen(false);
    } catch (error) {
      setDeleteLoading(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handlePermitSave = async () => {
    try {
      setSaveLoading(true);
      const params: any = {};
      params.userId = currentUser.id;
      params.permissions = [];
      checkOptions.forEach((item: any) => {
        if (item.checked) {
          const obj: any = {};
          obj.buttons = [];
          obj.id = item.id;
          if (item.plainOptions.length) {
            item.plainOptions.forEach((b: any) => {
              if (b.checked) {
                obj.buttons.push(b.value);
              }
            });
          }
          params.permissions.push(obj);
        }
      });
      console.log("********", params);
      const res: any = await addUserPermissions(params);
      if (res.data.code === 0) {
        message.success("保存成功");
        setCheckOptions([]);
      }
      setSaveLoading(false);
      setPermitOpen(false);
    } catch (error) {
      setSaveLoading(false);
    }
  };

  const handlePermitCancel = () => {
    setPermitOpen(false);
    setCheckOptions([]);
  };

  useEffect(() => {
    getUserData();
  }, []);

  const submit = async (values: any) => {
    try {
      setUserName(values.userName);
      getUserData(values.userName);
      setUserDataList([]);
    } catch (e) {}
  };

  return (
    <Layout curActive="/user/list">
      <Form form={form} onFinish={(values) => submit(values)}>
        <Form.Item name={"userName"}>
          <Search
            size={"large"}
            onSearch={() => form.submit()}
            enterButton
            disabled={disabledStatus}
            placeholder={"请输入用户名"}
          />
        </Form.Item>
      </Form>
      <Table
        columns={columns}
        dataSource={userDataList}
        rowKey={(record) => record.id}
      ></Table>
      <Modal
        title="删除用户"
        open={open}
        onCancel={handleCancel}
        footer={[
          <Button key={1} onClick={handleCancel}>
            取消
          </Button>,
          <Button
            key={2}
            type="primary"
            loading={deleteLoading}
            onClick={handleDelete}
          >
            删除
          </Button>,
        ]}
      >
        <p>确定要删除当前用户？删除以后无法找回。</p>
      </Modal>
      <Modal
        title="修改权限"
        open={permitOpen}
        onCancel={handlePermitCancel}
        footer={[
          <Button key={1} onClick={handlePermitCancel}>
            取消
          </Button>,
          <Button
            key={2}
            type="primary"
            loading={saveLoading}
            onClick={handlePermitSave}
          >
            保存
          </Button>,
        ]}
      >
        {!loading ? (
          <>
            {checkOptions.length > 0 &&
              checkOptions.map((item: any, index: any) => (
                <div key={index}>
                  <div
                    style={{ backgroundColor: "#EFF9FF", padding: "0 10px" }}
                  >
                    <Divider style={{ margin: "10px 0" }} />
                    <Checkbox
                      onChange={() => onCheckAllChange(item)}
                      checked={item.checked}
                      value={item.id}
                    >
                      {item.label}
                    </Checkbox>
                    <Divider style={{ margin: "10px 0" }} />
                  </div>

                  <div style={{ marginLeft: "0px", padding: "0 10px" }}>
                    {item.plainOptions.length > 0 &&
                      item.plainOptions.map((button: any, idx: any) => (
                        <Checkbox
                          key={idx}
                          onChange={() => onChange(item, button)}
                          checked={button.checked}
                          value={button.value}
                        >
                          {button.label}
                        </Checkbox>
                      ))}
                  </div>
                </div>
              ))}
          </>
        ) : (
          <div
            style={{
              height: "100px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Spin />
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default Page;

"use client";
import { useState, useRef, useEffect } from "react";
import {
  Button,
  Divider,
  Empty,
  Flex,
  Form,
  Input,
  List,
  Modal,
  Select,
  Tag,
  message,
} from "antd";
import {
  addMenuPermission,
  getPermissionList,
  getPermitButtons,
} from "@/services/points";
import React from "react";
import Layout from "@/components/Layout";
import styles from "../index.module.less";
import getNavList from "@/components/Layout/menu";
// import { buttonPermission } from "@/utils";
import { usePathname } from "next/navigation";
import { buttonPermission } from "@/utils";
import PermitButton from "@/components/button";

const Page: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [menus, setMenus] = useState<any[]>([]);
  const [nativeMenu, setNativeMenu] = useState<any[]>([]);
  const [selectMenuName, setSelectMenuName] = useState<string>("");
  const [buttonValues, setButtonValues] = useState<string>("");
  const [userPermissions, setUserPermissions] = useState<any[]>([]);
  const [permitButtns, setPermitButtns] = useState<any[]>([]);
  const [defaultButton, setDefaultButton] = useState<any>([]);

  const [isClient, setIsClient] = useState(false);

  const pathname: any = usePathname();

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 14 },
    },
  };
  const nativeMenus = () => {
    const menus = getNavList();
    let array: any[] = [];
    let childs: any[] = [];
    menus.forEach((item: any) => {
      let obj: any = {};
      obj.label = item.label;
      obj.title = item.key;
      obj.options = [];
      if (item.children) {
        item.children.forEach((child: any) => {
          obj.options.push({
            path: child.key,
            name: child.name,
            label: child.label,
            value: child.name,
          });
          childs.push({
            path: child.key,
            name: child.name,
            label: child.label,
            value: child.name,
          });
        });
      }
      array.push(obj);
    });
    return { array, childs };
  };

  useEffect(() => {
    setIsClient(true);
    const { array } = nativeMenus();
    setNativeMenu(array);
  }, []);

  const getMenus = async () => {
    const { array } = nativeMenus();
    setMenus(array);
    //   const res: any = await getMenuList();
    //   const list: any[] = res?.data?.list || [];
    //   const { array } = nativeMenus();
    //   // setMenus(list);
    //   // if (list.length === 0) {
    //   //   setMenus(array);
    //   // } else {

    //   // }
    // } catch (e) {
    //   console.error(e);
    // }
  };

  const getButtons = async () => {
    const btnRes: any = await getPermitButtons();
    const list = btnRes?.data?.list || [];
    const options: any = [];
    list.forEach((item: any) => {
      options.push({
        label: item.name,
        value: item.id,
      });
    });
    setPermitButtns(options);
  };

  const getPermis = async () => {
    try {
      const res: any = await getPermissionList();
      const list: any[] = res?.data?.list || [];
      setUserPermissions(list);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getPermis();
  }, []);

  // 添加权限 按钮
  const addPermission = () => {
    setOpen(true);
    getMenus();
    getButtons();
  };

  const menuSelectChange = (value: string) => {
    console.log(`selected ${value}`);
    setSelectMenuName(value);
  };

  const getButtonNames = (values: any) => {
    const buttons = permitButtns.filter((item: any) => {
      return values.includes(item.value);
    });
    const buttonName = buttons.map((item: any) => {
      return item.value;
    });
    setButtonValues(buttonName.join(","));
  };

  const handleSave = async () => {
    const { childs } = nativeMenus();
    const route = childs.find((item: any) => item.name === selectMenuName);
    const res: any = await addMenuPermission({
      buttons: buttonValues,
      name: route.name,
      path: route.path,
      label: route.label,
    });
    setOpen(false);
    setDefaultButton([]);
    if (res.data.code === 0) {
      getPermis();
      message.success("添加成功");
    } else {
      message.error("添加失败");
    }
  };

  const handleCancel = () => {
    setOpen(false);
    setDefaultButton([]);
  };
  return (
    <Layout curActive="/user/list">
      <Flex
        wrap
        gap="middle"
        justify="flex-end"
        className="site-button-ghost-wrapper"
      >
        <PermitButton
          type={"primary"}
          onClick={addPermission}
          path={pathname}
          permit={2}
        >
          添加权限
        </PermitButton>
      </Flex>
      <Divider />
      {userPermissions.length > 0 &&
        userPermissions.map((permit, index) => (
          <List key={index}>
            <a className={styles.menus}>{permit.label}</a>
            {permit.buttons.length > 0 &&
              permit.buttons.map((button: any, idx: any) => (
                <Tag className={styles.mr20} key={idx} color="#108ee9">
                  {button.name}
                </Tag>
              ))}
            <Divider />
          </List>
        ))}
      {userPermissions.length === 0 && <Empty />}
      <Modal
        title="添加权限"
        open={open}
        onOk={handleSave}
        onCancel={handleCancel}
      >
        <Form {...formItemLayout} variant="filled">
          <Form.Item
            label="选择菜单"
            name="Select"
            rules={[{ required: true, message: "请选择菜单" }]}
          >
            <Select
              placeholder="请选择菜单"
              options={menus}
              onChange={menuSelectChange}
            />
          </Form.Item>
          <Form.Item
            label="按钮名称"
            name="buttonName"
            rules={[{ required: true, message: "请选择按钮！" }]}
          >
            <Select
              mode="multiple"
              allowClear
              placeholder="请选择按钮权限"
              onChange={getButtonNames}
              options={permitButtns}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default Page;

"use client";
import { useState, useRef } from "react";
import { Col, Row, Button } from "antd";
import React from "react";
import Layout from "@/components/Layout";
import CreateUserModal from "./components/CreateUserModal";
import { SubmitValuesType } from "./components/CreateUserModal.type";

const Page: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<
    SubmitValuesType | undefined | null
  >();
  return (
    <Layout curActive="/dashboard/users/manage">
      <Row gutter={24}>
        <Col span={24}>
          <Button onClick={() => setShowCreateModal(true)} type={"primary"}>
            新增用户
          </Button>
        </Col>
      </Row>
      <br />
      {userInfo && "创建成功："} {userInfo?.username}&nbsp;&nbsp;
      {userInfo?.password}
      {showCreateModal && (
        <CreateUserModal
          visible={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onOk={(userInfo) => {
            setUserInfo(userInfo);
            setShowCreateModal(false);
          }}
        />
      )}
    </Layout>
  );
};

export default Page;

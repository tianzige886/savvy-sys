"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "antd";
import React from "react";
import styles from "../index.module.less";
import { usePathname } from "next/navigation";

const PermitButton: React.FC<any> = ({ path, permit, children, ...props }) => {
  const [isClient, setIsClient] = useState(false);

  const buttonPermission = (path: string, permit: string | number) => {
    if (!path || !permit) return false;
    if (typeof window != "undefined") {
      const local: any = window.localStorage.getItem("user_permission_list");
      const lUser: any = window.localStorage.getItem("balance_sys_user");
      const user: any = JSON.parse(lUser);
      if (user.role_id == 1) return true;
      const userPermits = JSON.parse(local);
      if (userPermits) {
        const item = userPermits.find((item: any) => item.path == path);
        if (item) {
          const buttons = item.buttons.split(",");
          return buttons.includes(String(permit));
        }
      }
      return false;
    } else {
      return false;
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !buttonPermission(path, permit)) {
    return null;
  }
  return (
    <>
      <Button {...props}>{children}</Button>
    </>
  );
};

export default PermitButton;

import req from "@/utils/req";
import qs from "qs";

/** 获取汇总数据图表 GET /api/history_checkin_total */
export const getCheckinTotalDataForCharts = (params) => {
  return req.post("/api/history_checkin_total", qs.stringify(params));
};

/** 获取当日数据图表 GET /api/history_checkin_day */
export const getCheckinDayDataForCharts = (params) => {
  return req.post("/api/history_checkin_day", qs.stringify(params));
};

/** 获取 GET /api/stat_checkin */
export const getCheckinData = (params) => {
  return req.post("/api/stat_checkin", qs.stringify(params));
};

/** 获取 GET /api/stat_checkin */
export const getUserCheckinData = (params) => {
  return req.post("/api/find_checkin", qs.stringify(params));
};

/** 获取 GET /api/find_credit */
export const getUserCreditData = (params) => {
  return req.post("/api/find_credit", qs.stringify(params));
};

/** 获取 GET /api/user */
export const getUserList = (params) => {
  return req.get(`/api/user?username=${params.username || ""}`);
};

/** 获取 GET /api/user/delete */
export const deleteUserById = (id) => {
  return req.post(`/api/user/delete`, { id });
};

/** 获取 GET /api/permission/menus */
export const getMenuList = () => {
  return req.get(`/api/permission/menus`);
};

/** 获取 GET /api/permission/add */
export const addMenuPermission = (params) => {
  return req.post(`/api/permission/add`, params);
};

/** 获取 GET /api/permission/get_permissions */
export const getPermissionList = () => {
  return req.get(`/api/permission/get_permissions`);
};

/** 获取 GET /api/permission/add_permissions */
export const addUserPermissions = (params) => {
  return req.post(`/api/permission/add_permissions`, {
    data: JSON.stringify(params),
  });
};
/** 获取 GET /api/user/delete */
export const getUserPermits = (userId) => {
  return req.post(`/api/permission/get_permit`, { userId });
};

/** 获取 GET /api/user/delete */
export const getPermitButtons = () => {
  return req.post(`/api/permission/buttons`);
};

export const uploadJson = () => {
  return req.post(`/api/upload/json`);
};
export const uploadImage = (params) => {
  return req.post(`/api/upload/image`, params);
};
export const uploadImageByNames = (params) => {
  return req.post(`/api/upload/upload_by_filename`, params);
};
export const uploadAwsByNames = (params) => {
  return req.post(`/api/game/awsimg`, params);
};

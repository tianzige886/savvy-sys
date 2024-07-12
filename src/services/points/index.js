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

import req from "@/utils/req";

export const createOne = (params: any) =>
  req.post("/api/weekRecommend/create", params);
export const deleteOne = (params: any) =>
  req.post("/api/weekRecommend/delete", params);
export const updateOne = (params: any) =>
  req.post("/api/weekRecommend/update", params);
export const getWeekRecommendGameList = (params: any) =>
  req.get("/api/weekRecommend/list", { params });
export const adultWeekRecommend = (params: any) =>
  req.post("/api/weekRecommend/adult", params);
export const awsWeekRecommend = (params: any) =>
  req.post("/api/weekRecommend/awsimg", params);
export const setHomeBanner = (params: any) =>
  req.post("/api/weekRecommend/set_home_banner", params);

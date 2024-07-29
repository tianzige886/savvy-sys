import req from "@/utils/req";

export const createRecommend = (params: any) =>
  req.post("/api/recommend/create", params);
export const deleteRecommend = (params: any) =>
  req.post("/api/recommend/delete", params);
export const updateRecommend = (params: any) =>
  req.post("/api/recommend/update", params);
export const getRecommendGameList = (params: any) =>
  req.get("/api/recommend/list", { params });
export const adultRecommend = (params: any) =>
  req.post("/api/recommend/adult", params);

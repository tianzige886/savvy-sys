import req from "@/utils/req";

export const createHot = (params: any) => req.post("/api/hot/create", params);
export const deleteHot = (params: any) => req.post("/api/hot/delete", params);
export const updateHot = (params: any) => req.post("/api/hot/update", params);
export const getHotGameList = (params: any) =>
  req.get("/api/hot/list", { params });
export const adultHot = (params: any) => req.post("/api/hot/adult", params);

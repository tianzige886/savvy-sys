import req from "@/utils/req";

// export const getGame = (params: any) => req.get("/api/game/detail", { params });
export const createBanner = (params: any) =>
  req.post("/api/banners/create", params);
export const deleteBanner = (params: any) =>
  req.post("/api/banners/delete", params);
export const updateBanner = (params: any) =>
  req.post("/api/banners/update", params);
export const getBannerGameList = (params: any) =>
  req.get("/api/banners/list", { params });
export const adultBanner = (params: any) =>
  req.post("/api/banners/adult", params);

import req from "@/utils/req";

export const getGame = (params: any) => req.get("/api/game/detail", { params });
export const getGameListByIds = (params: any) =>
  req.get("/api/game/listByIds", { params });
export const createGame = (params: any) => req.post("/api/game/create", params);
export const updateGame = (params: any) => req.post("/api/game/update", params);
export const getGameList = (params: any) =>
  req.get("/api/game/list", { params });
export const adultGame = (params: any) => req.post("/api/game/adult", params);

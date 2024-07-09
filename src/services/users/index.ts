import req from "@/utils/req";
import qs from "qs";

export const loginApi = (username: string, password: string) =>
    req.post("/api/login_username", qs.stringify({ username, password }));

export const getUserInfo = () => req.get("/api/user_info");

import req from "@/utils/req";
import qs from "qs";

export const loginApi = (username: string, password: string) =>
  req.post("/api/login_username", qs.stringify({ username, password }));

export const CreateUser = (username: string, password: string) =>
  req.post("/api/register_username", qs.stringify({ username, password }));

export const ResetPassword = (username: string, password: string) =>
  req.post("/api/reset_password", qs.stringify({ username, password }));

export const getUserInfo = () => req.get("/api/user_info");

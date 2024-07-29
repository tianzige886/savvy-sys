import req from "@/utils/req";
import qs from "qs";
export const getTags = () => req.get("/api/tag");

import { verifyToken } from "./jwt";

export const authMiddleware = (handler) => {
  return async (req, res) => {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: "Invalid token" });
    }
    try {
      const decoded = verifyToken(token);
      req.userId = decoded; // 将解码后的用户信息附加到请求对象上
      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ error: "Invalid token" });
    }
  };
};

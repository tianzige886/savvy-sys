import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET_KEY;
export const verifyToken = (token) => {
  return jwt.verify(token, secret);
};

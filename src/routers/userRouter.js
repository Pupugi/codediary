import "../models/User";
import express from "express";
import {
  logout,
  githubLogin,
  getEdit,
  postEdit,
  getChangePassword,
  postChangePassword,
  profile,
} from "../controllers/userController";
import { protectorMiddleware, publicOnlyMiddleware } from "../middlewares";

const userRouter = express.Router();

userRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(postEdit);
userRouter
  .route("/changePassword")
  .all(protectorMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);
userRouter.get("/github/login", publicOnlyMiddleware, githubLogin);
userRouter.get("/logout", protectorMiddleware, logout);
userRouter.get("/:id", profile);

export default userRouter;

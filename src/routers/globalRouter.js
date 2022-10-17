import "../models/Contents";
import "../models/User";
import express from "express";
import {
  home,
  getReviews,
  getProcess,
  getSkills,
  getErrors,
} from "../controllers/contentsController";
import {
  getJoin,
  getLogin,
  postJoin,
  postLogin,
} from "../controllers/userController";
import { publicOnlyMiddleware } from "../middlewares";

const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.get("/process", getProcess);
globalRouter.get("/skills", getSkills);
globalRouter.get("/errors", getErrors);
globalRouter.get("/reviews", getReviews);
globalRouter
  .route("/join")
  .all(publicOnlyMiddleware)
  .get(getJoin)
  .post(postJoin);
globalRouter
  .route("/login")
  .all(publicOnlyMiddleware)
  .get(getLogin)
  .post(postLogin);

export default globalRouter;

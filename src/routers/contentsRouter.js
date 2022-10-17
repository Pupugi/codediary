import "../models/Contents";
import express from "express";
import {
  detail,
  getEdit,
  postEdit,
  getUpload,
  postUpload,
  deleteContents,
} from "../controllers/contentsController";
import { protectorMiddleware } from "../middlewares";

const contentsRouter = express.Router();

contentsRouter.get("/:id([0-9a-f]{24})", detail);
contentsRouter.get(
  "/:id([0-9a-f]{24})/delete",
  protectorMiddleware,
  deleteContents
);
contentsRouter
  .route("/:id([0-9a-f]{24})/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(postEdit);
contentsRouter
  .route("/upload")
  .all(protectorMiddleware)
  .get(getUpload)
  .post(postUpload);

export default contentsRouter;

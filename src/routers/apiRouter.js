import express from "express";
import {
  registerView,
  createComment,
  deleteComment,
} from "../controllers/contentsController";

const apiRouter = express.Router();

apiRouter.post("/contents/:id([0-9a-f]{24})/view", registerView);
apiRouter.post("/contents/:id([0-9a-f]{24})/comment", createComment);
apiRouter.post("/comment/:id", deleteComment);

export default apiRouter;

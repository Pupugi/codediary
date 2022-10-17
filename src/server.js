import express from "express";
import session from "express-session";
import flash from "express-flash";
import MongoStore from "connect-mongo";
import globalRouter from "./routers/globalRouter";
import contentsRouter from "./routers/contentsRouter";
import userRouter from "./routers/userRouter";
import apiRouter from "./routers/apiRouter";
import { localsMiddleware } from "./middlewares";

const app = express();

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.COOCIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_RUL }),
  })
);

app.use(flash());
app.use(localsMiddleware);
app.use("/static", express.static("assets"));
app.use("/", globalRouter);
app.use("/contents", contentsRouter);
app.use("/user", userRouter);
app.use("/api", apiRouter);

export default app;

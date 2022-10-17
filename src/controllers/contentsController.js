import Contents from "../models/Contents";
import User from "../models/User";
import Comment from "../models/Comment";
import fetch from "node-fetch";

export const home = (req, res) => {
  return res.render("home", { pageTitle: "Welcome to my Code-Diary" });
};

export const getProcess = async (req, res) => {
  const contents = await Contents.find({ category: "process" });
  return res.render("list", {
    contents,
    pageTitle: "어떤 과정으로 이 사이트를 만들었을까?",
  });
};

export const getSkills = async (req, res) => {
  const contents = await Contents.find({ category: "skills" });
  return res.render("list", {
    contents,
    pageTitle: "이 사이트를 만드는데 사용한 기술들",
  });
};

export const getErrors = async (req, res) => {
  const contents = await Contents.find({ category: "errors" });
  return res.render("list", {
    contents,
    pageTitle: "만들때 겪었던 에러",
  });
};

export const getReviews = async (req, res) => {
  const contents = await Contents.find({ category: "reviews" });
  return res.render("list", {
    contents,
    pageTitle: "만들면서 느낀점",
  });
};

export const detail = async (req, res) => {
  const { id } = req.params;
  const content = await Contents.findById(id)
    .populate("owner")
    .populate("comments");
  fetch(
    `https://code-diary-first-version.herokuapp.com/api/contents/${id}/view`,
    {
      method: "POST",
    }
  );
  return res.render("detail", {
    pageTitle: `${content.title}`,
    content,
  });
};

export const getEdit = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id },
    },
  } = req;
  const contents = await Contents.findById(id);
  if (String(contents.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  return res.render("editCon", { contents, pageTitle: "Edit Contents" });
};

export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    params: { id },
    body: { title, category, paragraph },
  } = req;
  const contents = await Contents.findById(id);
  if (String(contents.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  await Contents.findByIdAndUpdate(id, {
    title,
    category,
    paragraph,
  });
  return res.redirect("/");
};

export const getUpload = async (req, res) => {
  return res.render("upload", { pageTitle: "Upload Contents" });
};

export const postUpload = async (req, res) => {
  const {
    body: { title, paragraph, category },
    session: {
      user: { _id: id },
    },
  } = req;
  const newContents = await Contents.create({
    title,
    category,
    paragraph,
    owner: id,
  });
  const user = await User.findById(id);
  user.contents.push(newContents._id);
  user.save();
  return res.redirect("/");
};

export const deleteContents = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id },
    },
  } = req;
  const contents = await Contents.findById(id);
  if (String(contents.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  await Contents.findByIdAndDelete(id);
  return res.redirect("/");
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const contents = await Contents.findById(id);
  if (!contents) {
    return res.sendStatus(404);
  }
  contents.meta.views = contents.meta.views + 1;
  await contents.save();
  return res.sendStatus(200);
};

export const createComment = async (req, res) => {
  const {
    session: { user },
    body: { text },
    params: { id },
  } = req;
  const contents = await Contents.findById(id);
  if (!contents) {
    return res.sendStatus(404);
  }
  const comment = await Comment.create({
    text,
    owner: user._id,
    contents: id,
  });
  contents.comments.push(comment);
  contents.save();
  return res.status(201).json({ newCommentId: comment._id });
};

export const deleteComment = async (req, res) => {
  const id = req.params.id;
  await Comment.findByIdAndDelete(id);
  return res.sendStatus(202);
};

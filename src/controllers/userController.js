import User from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => {
  return res.render("join", { pageTitle: "Join" });
};

export const postJoin = async (req, res) => {
  const { email, username, nickname, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.status(400).render("/join", {
      pageTitle: "Join",
      errorMessage: "Password confirmation does not match.",
    });
  }
  const emailExist = await User.exists({ email });
  const usernameExist = await User.exists({ username });
  if (emailExist) {
    return res.status(400).render("/join", {
      pageTitle: "Join",
      errorMessage: "This email is already taken.",
    });
  }
  if (usernameExist) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage: "This username is already taken.",
    });
  }
  try {
    await User.create({
      email,
      username,
      nickname,
      password,
      socialOnly: false,
    });
    return res.redirect("/login");
  } catch (err) {
    return res.status(400).render("/join", {
      pageTitle: "Join",
      errorMessage: err._message,
    });
  }
};

export const getLogin = (req, res) => {
  return res.render("login", { pageTitle: "Login" });
};

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const usernameCheck = await User.exists({ username });
  if (!usernameCheck) {
    return res.status(400).render("login", {
      pageTitle: "login",
      errorMessage: "An account with this username does not exists.",
    });
  }
  const user = await User.findOne({ username, socialOnly: false });
  const passwordCheck = await bcrypt.compare(password, user.password);
  if (!passwordCheck) {
    return res.status(400).render("login", {
      pageTitle: "Login",
      errorMessage: "Wrong Password",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};

export const githubLogin = async (req, res) => {
  const tokenRequest = await (
    await fetch(
      `https://github.com/login/oauth/access_token?client_id=eb96633ab97eec1e11c3&client_secret=${process.env.GH_SECRET}&code=${req.query.code}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      }
    )
  ).json();
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      return res.redirect("/login");
    }
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      user = await User.create({
        username: userData.login,
        nickname: userData.nickname ? userData.nickname : "Anonymous",
        email: emailObj.email,
        password: null,
        socialOnly: true,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

export const getEdit = (req, res) => {
  return res.render("editUser", { pageTitle: "Edit your Profile" });
};

export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id: id, email: sessionEmail, username: sessionUsername },
    },
    body: { email, username, nickname },
  } = req;
  const emailExist = await User.exists({ email });
  const usernameExist = await User.exists({ username });
  if (emailExist && sessionEmail !== email) {
    return res.status(400).render("editUser", {
      pageTitle: "Join",
      errorMessage: "This email is already taken.",
    });
  }
  if (usernameExist && sessionUsername !== username) {
    return res.status(400).render("editUser", {
      pageTitle: "Join",
      errorMessage: "This username is already taken.",
    });
  }
  const updateUser = await User.findByIdAndUpdate(
    id,
    {
      email,
      username,
      nickname,
    },
    { new: true }
  );
  req.session.user = updateUser;
  return res.redirect("/user/edit");
};

export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly === true) {
    return res.redirect("/");
  }
  return res.render("changePassword", { pageTitle: "Change Password" });
};

export const postChangePassword = async (req, res) => {
  const {
    session: {
      user: { _id: id },
    },
    body: { oldPassword, newPassword, newPasswordConfirm },
  } = req;
  const user = await User.findById(id);
  const checkPassword = await bcrypt.compare(oldPassword, user.password);
  if (!checkPassword) {
    return res.status(400).render("changePassword", {
      pageTitle: "Change Password",
      errorMessage: "Password is wrong",
    });
  }
  if (newPassword !== newPasswordConfirm) {
    return res.status(400).render("changePassword", {
      pageTitle: "Change Password",
      errorMessage: "New password confirmation is incorrect",
    });
  }
  user.password = newPassword;
  user.save();
  return res.redirect("/user/logout");
};

export const profile = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate("contents");
  if (!user) {
    return res.status(404).render("404", { pageTitle: "User not found." });
  }
  return res.render("profile", {
    pageTitle: user.nickname,
    user,
  });
};

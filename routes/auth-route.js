const router = require("express").Router();
const passport = require("passport");
const User = require("../models/user-model");
const bcrypt = require("bcrypt");

router.get("/login", (req, res) => {
  return res.render("login", { user: req.user });
});

router.get("/logout", (req, res) => {
  req.logOut((e) => {
    if (e) {
      return res.send(e);
    }
    return res.redirect("/");
  });
});

router.get("/signup", (req, res) => {
  return res.render("signup", { user: req.user });
});

router.post("/signup", async (req, res) => {
  let { name, email, password } = req.body;
  let foundUser = await User.findOne({ email }).exec();

  if (foundUser) {
    req.flash("error_msg", "信箱已被註冊，請登入或更換信箱");
    return res.redirect("/auth/signup");
  }
  if (password.length < 8) {
    req.flash("error_msg", "密碼長度不足，請設定8個以上英文和數字的密碼");
    return res.redirect("/auth/signup");
  }

  let hashPassword = await bcrypt.hash(password, 12);
  let newUser = new User({
    name,
    email,
    password: hashPassword,
  });
  await newUser.save();
  req.flash("success_msg", "已註冊成功，請登入帳號");
  return res.redirect("/auth/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/auth/login",
    failureFlash: "登入失敗，帳號或密碼錯誤",
  }),
  (req, res) => {
    return res.redirect("/profile");
  }
);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  return res.redirect("/profile");
});

module.exports = router;

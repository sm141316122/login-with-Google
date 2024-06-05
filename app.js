const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authRoute = require("./routes/auth-route");
const profileRoute = require("./routes/profile-route");
const passport = require("passport");
const session = require("express-session");
const flash = require("connect-flash");
require("./config/passport");

mongoose
  .connect("mongodb://127.0.0.1:27017/exampleDB")
  .then(() => {
    console.log("Database connect success");
  })
  .catch((e) => {
    console.log(e);
  });

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

app.use("/auth", authRoute);
app.use("/profile", profileRoute);

app.get("/", (req, res) => {
  return res.render("index", { user: req.user });
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});

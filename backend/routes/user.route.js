const express = require("express");
const { UserModel } = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userRoute = express.Router();

userRoute.post("/register", async (req, res) => {
  const { name, email, password, phone, age, country} = req.body;
  try {
    bcrypt.hash(password, 5, async (err, hash) => {
      // Store hash in your passwordword DB.
      if (err) {
        res.send({ msg: "something went wrong", error: err.message });
      } else {
        const user = new UserModel({ name, email, password: hash });
        await user.save();
        res.send({ msg: "New user registered" });
      }
    });
  } catch (err) {
    res.send({ msg: "something went wrong", error: err.message });
  }
});

userRoute.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.find({ email });
    if (user.length > 0) {
      bcrypt.compare(password, user[0].password, (err, result) => {
        // result == true
        if (result) {
          let token = jwt.sign({ userID: user[0]._id }, "masai");
          res.send({ msg: "Login in", token: token });
        } else {
          res.send({
            msg: "something went wrong",
            error: err.message,
          });
        }
      });
    } else {
      res.send({ msg: "Wrong credentials" });
    }
  } catch (err) {
    res.send({ msg: "something went wrong", error: err.message });
  }
});

module.exports = {
  userRoute,
};

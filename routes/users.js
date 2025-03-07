const express = require("express");
const router = express.Router();
const validateUser = require("../validations/userValidation");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
// const loadash = require("loadash");
const bcrypt = require("bcrypt");
router.get("/", async (req, res) => {
  const users = await User.find().sort("name");
  res.status(200).send(users);
});

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }

  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).send({ message: "user already registered." });
  }

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  // const token = jwt.sign({ _id: user._id }, "privateKey");

  const token = user.generateAuthToken();

  return res.header("x-auth-token", token).status(201).send({
    message: "Registed Successfully",
  });
});

module.exports = router;

const express = require("express");
const router = express.Router();
const validateAuth = require("../validations/authValidation");
const User = require("../models/User");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  const { error } = validateAuth(req.body);
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }

  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.send({ message: "Invalid email or password." });
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.send({ message: "Invalid email or password." });
  }
  const token = user.generateAuthToken();
  res.send(token);
});

module.exports = router;

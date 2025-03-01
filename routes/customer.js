const express = require("express");
const router = express.Router();
const validateCustomer = require("../validations/customerValidation");
const Customer = require("../models/customer");
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  const customers = await Customer.find().sort("name");
  res.status(200).send(customers);
});

router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    res.status(404).send({
      message: "The customer with the ID was not found, try with different ID",
    });
  }
  res.status(200).send(customer);
});

router.post("/", auth, async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }
  let customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  });
  customer = await customer.save();
  res.status(201).send({ message: "added successfully", customer });
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }
  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      phone: req.body.phone,
      isGold: req.body.isGold,
    },
    {
      new: true,
    }
  );

  if (!customer) {
    res.status(404).send({
      message: "The customer with the ID was not found, try with different ID",
    });
  }
  res.status(200).send({ message: "Updated Successfully", customer });
});

router.delete("/:id", auth, async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);
  if (!customer) {
    res.status(404).send({
      message: "The customer with the ID was not found, try with different ID",
    });
  }
  res.status(200).send({ message: "Deleted Successfully", customer });
});
module.exports = router;

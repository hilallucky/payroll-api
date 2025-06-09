const express = require("express");
const router = express.Router();
const employeeController = require("../../controllers/employeeController");

router.get("/", employeeController.getAllEmployees);

router.get("/check", (req, res) => {
    res.json({ message: "Welcome to employee routes" });
});

module.exports = router;

const express = require("express");
const router = express.Router();
const payrollController = require("../../controllers/payrollController");
const { validateRequest } = require("../../middlewares/validationRequest");
const {
    createPayrollSchemaValidation,
} = require("../../validations/payrollValidation");

router.post(
    "/",
    validateRequest({
        body: createPayrollSchemaValidation,
    }),
    payrollController.createPayroll
);
router.get("/", payrollController.getAllPayrolls);
router.get("/:id", payrollController.getAllPayrollsById);

module.exports = router;

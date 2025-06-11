const express = require("express");
const router = express.Router();
const payslipsController = require("../../controllers/payslipController");
const { validateRequest } = require("../../middlewares/validationRequest");
const {
    createPayslipByIdSchemaValidation,
    createAllPayslipSchemaValidation,
    createSummPayslipSchemaValidation,
} = require("../../validations/payslipValidation");

router.get("/", payslipsController.generatePayslipById);
router.get("/all", payslipsController.generateSummaryPayslip);
router.get("/period", payslipsController.getAllPayrollPeriod);

module.exports = router;

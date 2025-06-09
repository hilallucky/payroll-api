const express = require("express");
const router = express.Router();
const payslipsController = require("../../controllers/payslipController");
const { validateRequest } = require("../../middlewares/validationRequest");
const {
    createPayslipSchemaValidation,
} = require("../../validations/payslipValidation");

router.post(
    "/",
    validateRequest({
        body: createPayslipSchemaValidation,
    }),
    payslipsController.createPayslip
);
router.get("/", payslipsController.getAllPayslips);
router.get("/:id", payslipsController.getAllPayslipsById);

module.exports = router;

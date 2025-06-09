const express = require("express");
const router = express.Router();
const reimbursementController = require("../../controllers/reimbursementController ");
const {
    createReimbursementSchemaValidation,
} = require("../../validations/reimbursementValidation");
const { validateRequest } = require("../../middlewares/validationRequest");

router.post(
    "/",
    validateRequest({
        body: createReimbursementSchemaValidation,
    }),
    reimbursementController.createReimbursement
);
router.get("/", reimbursementController.getAllReimbursement);
router.get("/:id", reimbursementController.getAllReimbursementByEmployeeId);

module.exports = router;

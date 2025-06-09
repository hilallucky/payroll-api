const express = require("express");
const router = express.Router();
const overtimeController = require("../../controllers/overtimeController");
const {
    createOvertimeSchemaValidation,
} = require("../../validations/overtimeValidation");
const { validateRequest } = require("../../middlewares/validationRequest");

router.post(
    "/",
    validateRequest({
        body: createOvertimeSchemaValidation,
    }),
    overtimeController.createOvertime
);
router.get("/", overtimeController.getAllOvertime);
router.get("/:id", overtimeController.getAllOvertimeByEmployeeId);

module.exports = router;

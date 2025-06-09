const express = require("express");
const router = express.Router();
const attendanceController = require("../../controllers/attendanceController");
const {
    createAttendanceSchemaValidation,
} = require("../../validations/attendanceValidation");
const { validateRequest } = require("../../middlewares/validationRequest");

router.post(
    "/",
    validateRequest({
        body: createAttendanceSchemaValidation,
    }),
    attendanceController.createAttendance
);
router.get("/", attendanceController.getAllAttendance);
router.get("/:id", attendanceController.getAllAttendanceByEmployeeId);

module.exports = router;

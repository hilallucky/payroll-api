const express = require("express");
const router = express.Router();
const attendancePeriodsController = require("../../controllers/attendancePeriodController");
const { validateRequest } = require("../../middlewares/validationRequest");
const {
    createAttendancePeriodSchemaValidation,
} = require("../../validations/attendanceValidation");

router.post(
    "/",
    validateRequest({
        body: createAttendancePeriodSchemaValidation,
    }),
    attendancePeriodsController.createAttendancePeriod
);
router.get("/", attendancePeriodsController.getAllAttendancePeriods);
router.get("/:id", attendancePeriodsController.getAllAttendancePeriodsById);

module.exports = router;

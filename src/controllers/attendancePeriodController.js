const { statusCodes } = require("../constants/contsant");
const attendancePeriodService = require("../services/attendancePeriodService");
const { successResponse, errorResponse } = require("../utils/baseResponse");

createAttendancePeriod = async (req, res) => {
    const { payrollId, startDate, endDate } = req.body;

    const start = new Date(startDate);
    const end = new Date(endDate);

    try {
        const attendancePeriods =
            await attendancePeriodService.createAttendancePeriod(
                payrollId,
                start,
                end,
                req.user.id,
                req.ip
            );

        return successResponse(
            res,
            "Attendance period created successfully",
            attendancePeriods
        );
    } catch (err) {
        let message = "Server Error",
            errCode = statusCodes.SERVER_ISSUE;
        if ((err.message = "Overlapping periods found")) {
            message = "Overlapping periods";
            errCode = statusCodes.BAD_REQUEST;
        }
        return errorResponse(res, message, err.message, errCode);
    }
};

getAllAttendancePeriods = async (req, res) => {
    const payrollId = req.query?.payrollId;
    const startDate = req.query?.startDate;
    const endDate = req.query?.endDate;

    try {
        const attendancePeriods =
            await attendancePeriodService.getAllAttendancePeriods(
                payrollId,
                startDate,
                endDate
            );
        return successResponse(
            res,
            "Attendance retrieved successfully",
            attendancePeriods
        );
    } catch (err) {
        return errorResponse(res, "Failed to retrieve attendance", err);
    }
};

getAllAttendancePeriodsById = async (req, res) => {
    const { id } = req.params;

    try {
        const attendancePeriods =
            await attendancePeriodService.getAllAttendancePeriodsById(id);

        return successResponse(
            res,
            "Attendance retrieved successfully",
            attendancePeriods
        );
    } catch (err) {
        return errorResponse(res, "Failed to retrieve attendance", err.message);
    }
};

module.exports = {
    createAttendancePeriod,
    getAllAttendancePeriods,
    getAllAttendancePeriodsById,
};

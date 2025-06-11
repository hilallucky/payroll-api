const { statusCodes } = require("../constants/contsant");
const attendanceService = require("../services/attendanceService");
const { successResponse, errorResponse } = require("../utils/baseResponse");

createAttendance = async (req, res) => {
    const { employeeId, payrollId, attendanceDate, attendanceType } = req.body;

    const attDate = attendanceDate
        ? new Date(attendanceDate).toISOString().slice(0, 19)
        : new Date().toISOString().slice(0, 19);

    const dayOfWeek = new Date(attendanceDate).getDay();

    if (dayOfWeek === 0 || dayOfWeek === 6) {
        // Check if it's Sunday (0) or Saturday (6)
        return errorResponse(
            res,
            "Not allowed to record attendance",
            "Attendance cannot be recorded on Saturday or Sunday, take a rest.",
            statusCodes.BAD_REQUEST
        );
    }

    try {
        const attendancePeriods = await attendanceService.createAttendance(
            employeeId,
            payrollId,
            attendanceType,
            attDate,
            req.user.id,
            req.ip
        );

        return successResponse(
            res,
            `Attendance for employee ${employeeId} created successfully`,
            attendancePeriods
        );
    } catch (err) {
        let message = "Employee not found"
                ? "Employee not found"
                : "Server Error",
            errCode = statusCodes.SERVER_ISSUE;
        if ((err.message = "Employee not found")) {
            message = "Employee not found";
            errCode = statusCodes.BAD_REQUEST;
        }
        if (
            (err.message =
                "Not allowed to attend for overtime, because you not porpose overtime for this time.")
        ) {
            message = "Propose you overtime first!";
            errCode = statusCodes.BAD_REQUEST;
        }

        return errorResponse(res, message, err.message, errCode);
    }
};

getAllAttendance = async (req, res) => {
    try {
        const attendancePeriods = await attendanceService.getAllAttendance();
        return successResponse(
            res,
            "Employees attendance retrieved successfully",
            attendancePeriods
        );
    } catch (err) {
        return errorResponse(res, "Failed to retrieve attendance", err);
    }
};

getAllAttendanceByEmployeeId = async (req, res) => {
    const { id } = req.params;
    try {
        const attendancePeriods =
            await attendanceService.getAllAttendanceByEmployeeId(id);
        return successResponse(
            res,
            "Employees attendance retrieved successfully",
            attendancePeriods
        );
    } catch (err) {
        return errorResponse(res, "Failed to retrieve attendance", err);
    }
};

module.exports = {
    createAttendance,
    getAllAttendance,
    getAllAttendanceByEmployeeId,
};

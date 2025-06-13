const moment = require("moment");
const { statusCodes } = require("../constants/contsant");
const overtimeService = require("../services/overtimeService");
const { successResponse, errorResponse } = require("../utils/baseResponse");

createOvertime = async (req, res) => {
    const { employeeId, payrollId, duration, startDate, endDate, description } =
        req.body;

    const startAt = new Date(startDate)
        .toISOString()
        .slice(0, 19)
        .toLocaleString();

    let durationTime = 0,
        endAt;

    if (endDate && !duration) {
        endAt = new Date(endDate).toISOString().slice(0, 19).toLocaleString();
        durationTime = calculationDuration(startAt, endAt);
    } else {
        endAt = new Date(startDate).setHours(
            new Date(startDate).getHours() + duration
        );
    }

    if (duration > 3 || durationTime > 3) {
        return errorResponse(
            res,
            "Out of limit hours.",
            "Overtime limited only 3 hours per day.",
            statusCodes.BAD_REQUEST
        );
    }
    try {
        const overtimePeriod = await overtimeService.createOvertime(
            employeeId,
            payrollId,
            new Date(),
            startAt,
            endAt,
            parseInt(duration || durationTime),
            description,
            req.user.id,
            req.ip
        );

        return successResponse(
            res,
            `Overtime for employee ${employeeId} created successfully`,
            overtimePeriod
        );
    } catch (err) {
        return errorResponse(
            res,
            err.message == "Not allowed to propose overtime this time."
                ? err.message
                : "Server Error",
            err.message == "Not allowed to propose overtime this time."
                ? "Overtime hours exceed work hours. Try again in few hours."
                : err.message,
            err.message == "Not allowed to propose overtime this time."
                ? statusCodes.BAD_REQUEST
                : statusCodes.SERVER_ISSUE
        );
    }
};

calculationDuration = (startAt, endAt) => {
    const checkInTime = new Date(startAt);
    const checkOutTime = new Date(endAt);

    const durationMs = checkOutTime.getTime() - checkInTime.getTime();
    const durationHours = durationMs / (1000 * 60 * 60);

    const THREE_HOURS_MS = 3 * 60 * 60 * 1000;

    // if (durationMs > THREE_HOURS_MS) {
    return durationHours.toFixed(2);
    // }
};

getAllOvertime = async (req, res) => {
    try {
        const overtimes = await overtimeService.getAllOvertime();
        return successResponse(
            res,
            "Employees overtime retrieved successfully",
            overtimes
        );
    } catch (err) {
        return errorResponse(res, "Failed to retrieve overtime", err.message);
    }
};

getAllOvertimeByEmployeeId = async (req, res) => {
    try {
        const overtimes = await overtimeService.getAllOvertimeByEmployeeId(
            req.params.id
        );
        return successResponse(
            res,
            "Employees overtime retrieved successfully",
            overtimes
        );
    } catch (err) {
        return errorResponse(res, "Failed to retrieve overtime", err);
    }
};

module.exports = {
    createOvertime,
    getAllOvertime,
    getAllOvertimeByEmployeeId,
};

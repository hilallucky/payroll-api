const { statusCodes } = require("../constants/contsant");
const payrollService = require("../services/payrollService");
const { successResponse, errorResponse } = require("../utils/baseResponse");

createPayroll = async (req, res) => {
    const { startDate, endDate } = req.body;

    const start = new Date(startDate);
    const end = new Date(endDate);

    try {
        const payroll = await payrollService.createPayroll(
            start,
            end,
            req.user.id,
            req.ip,
            req,
            res
        );

        return successResponse(
            res,
            "Payroll period created successfully",
            payroll,
            statusCodes.CREATED
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

getAllPayrolls = async (req, res) => {
    const startDate = req.query?.startDate;
    const endDate = req.query?.endDate;

    try {
        const payrolls = await payrollService.getAllPayrolls(
            startDate,
            endDate
        );
        return successResponse(res, "Payroll retrieved successfully", payrolls);
    } catch (err) {
        return errorResponse(res, "Failed to retrieve payroll", err);
    }
};

getAllPayrollsById = async (req, res) => {
    const { id } = req.params;

    try {
        const payrolls = await payrollService.getAllPayrollsById(id);

        return successResponse(res, "Payroll retrieved successfully", payrolls);
    } catch (err) {
        return errorResponse(res, "Failed to retrieve payroll", err.message);
    }
};

module.exports = {
    createPayroll,
    getAllPayrolls,
    getAllPayrollsById,
};

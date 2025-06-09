const { statusCodes } = require("../constants/contsant");
const payslipService = require("../services/payslipService");
const { successResponse, errorResponse } = require("../utils/baseResponse");

createPayslip = async (req, res) => {
    const { startDate, endDate } = req.body;

    const start = new Date(startDate);
    const end = new Date(endDate);

    try {
        const payslip = await payslipService.createPayslip(
            start,
            end,
            req.user.id,
            req.ip,
            req,
            res
        );

        return successResponse(
            res,
            "Payslip period created successfully",
            payslip,
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

getAllPayslips = async (req, res) => {
    const startDate = req.query?.startDate;
    const endDate = req.query?.endDate;

    try {
        const payslips = await payslipService.getAllPayslips(
            startDate,
            endDate
        );
        return successResponse(res, "Payslip retrieved successfully", payslips);
    } catch (err) {
        return errorResponse(res, "Failed to retrieve payslip", err);
    }
};

getAllPayslipsById = async (req, res) => {
    const { id } = req.params;

    try {
        const payslips = await payslipService.getAllPayslipsById(id);

        return successResponse(res, "Payslip retrieved successfully", payslips);
    } catch (err) {
        return errorResponse(res, "Failed to retrieve payslip", err.message);
    }
};

module.exports = {
    createPayslip,
    getAllPayslips,
    getAllPayslipsById,
};

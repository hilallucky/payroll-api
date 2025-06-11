const { statusCodes } = require("../constants/contsant");
const payslipService = require("../services/payslipService");
const { successResponse, errorResponse } = require("../utils/baseResponse");

generatePayslipById = async (req, res) => {
    const { employeeId, monthPeriod, yearPeriod } = req.query;

    try {
        const payslip = await payslipService.getAllPayslipsById(req.query);

        return successResponse(
            res,
            "Payslip generated successfully",
            payslip,
            statusCodes.SUCCESS
        );
    } catch (err) {
        return errorResponse(
            res,
            err.message,
            err.message,
            statusCodes.BAD_REQUEST
        );
    }
};

generateAllPayslips = async (req, res) => {
    const { employeeId, monthPeriod, yearPeriod } = req.query;

    try {
        const payslip = await payslipService.getAllPayslipsById(req.query);

        return successResponse(
            res,
            "Payslip generated successfully",
            payslip,
            statusCodes.SUCCESS
        );
    } catch (err) {
        return errorResponse(
            res,
            err.message,
            err.message,
            statusCodes.BAD_REQUEST
        );
    }
};

generateSummaryPayslip = async (req, res) => {
    try {
        const payslip = await payslipService.generateSummaryPayslip(req.query);

        return successResponse(
            res,
            "Payslip summary generated successfully",
            payslip,
            statusCodes.SUCCESS
        );
    } catch (err) {
        console.log(err);

        return errorResponse(
            res,
            err.message,
            err.message,
            statusCodes.BAD_REQUEST
        );
    }
};

getAllPayrollPeriod = async (req, res) => {
    try {
        const payslip = await payslipService.getAllPayrollPeriod(req.query);

        return successResponse(
            res,
            "List all payroll periods",
            payslip,
            statusCodes.SUCCESS
        );
    } catch (err) {
        return errorResponse(
            res,
            err.message,
            err.message,
            statusCodes.BAD_REQUEST
        );
    }
};

module.exports = {
    generatePayslipById,
    generateAllPayslips,
    generateSummaryPayslip,
    getAllPayrollPeriod,
};

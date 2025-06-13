const moment = require("moment");
const { statusCodes } = require("../constants/contsant");
const reimbursementService = require("../services/reimbursementService");
const { successResponse, errorResponse } = require("../utils/baseResponse");

createReimbursement = async (req, res) => {
    const { employeeId, payrollId, amount, description, status, date } =
        req.body;

    try {
        const reimbursementPeriod =
            await reimbursementService.createReimbursement(
                employeeId,
                payrollId,
                amount,
                description,
                status,
                date,
                req.user.id,
                req.ip
            );

        return successResponse(
            res,
            `Reimbursement for employee ${employeeId} created successfully`,
            reimbursementPeriod
        );
    } catch (err) {
        return errorResponse(
            res,
            err.message == "Employee not found" ? err.message : "Server Error",
            err.message == "Employee not found"
                ? "Employee not founded"
                : err.message,
            err.message == "Employee not found"
                ? statusCodes.BAD_REQUEST
                : statusCodes.BAD_REQUEST
        );
        // return errorResponse(
        //     res,
        //     "Server Error",
        //     err.message,
        //     statusCodes.SERVER_ISSUE
        // );
    }
};

getAllReimbursement = async (req, res) => {
    try {
        const reimbursements = await reimbursementService.getAllReimbursement();
        return successResponse(
            res,
            "Employees reimbursement retrieved successfully",
            reimbursements
        );
    } catch (err) {
        return errorResponse(res, "Failed to retrieve reimbursement", err);
    }
};

getAllReimbursementByEmployeeId = async (req, res) => {
    try {
        const reimbursements =
            await reimbursementService.getAllReimbursementByEmployeeId(
                req.params.id
            );
        return successResponse(
            res,
            "Employees reimbursement retrieved successfully",
            reimbursements
        );
    } catch (err) {
        return errorResponse(res, "Failed to retrieve reimbursement", err);
    }
};

module.exports = {
    createReimbursement,
    getAllReimbursement,
    getAllReimbursementByEmployeeId,
};

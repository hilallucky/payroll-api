const { statusCodes } = require("../constants/contsant");
const employeeService = require("../services/employeeService");
const { successResponse, errorResponse } = require("../utils/baseResponse");

const getAllEmployees = async (req, res) => {
    try {
        const employees = await employeeService.getAllEmployees();
        return successResponse(
            res,
            "Employees retrieved successfully",
            employees
        );
    } catch (err) {
        return errorResponse(
            res,
            "Failed to retrieve employees",
            err,
            statusCodes.SERVER_ISSUE
        );
    }
};

module.exports = {
    getAllEmployees,
};

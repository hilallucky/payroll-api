const Joi = require("joi").extend(require("@joi/date"));
const { payslipStatus } = require("../constants/contsant");
const validPayslipStatus = Object.values(payslipStatus);

const createPayslipByIdSchemaValidation = Joi.object({
    employeeId: Joi.number().required().label("employeeId"),
    month: Joi.number().optional().label("month").min(1).max(12),
    year: Joi.number().optional().label("year").min(1),
});

const createAllPayslipSchemaValidation = Joi.object({
    month: Joi.number().optional().label("month").min(1).max(12),
    year: Joi.number().optional().label("year").min(1),
});

const createSummPayslipSchemaValidation = Joi.object({
    employeeId: Joi.number().optional().label("employeeId"),
    month: Joi.number().optional().label("month").min(1).max(12),
    year: Joi.number().optional().label("year").min(1),
});

module.exports = {
    createPayslipByIdSchemaValidation,
    createAllPayslipSchemaValidation,
    createSummPayslipSchemaValidation,
};

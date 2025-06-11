const Joi = require("joi").extend(require("@joi/date"));
const { payslipStatus } = require("../constants/contsant");
const validPayslipStatus = Object.values(payslipStatus);

const createPayslipByIdSchemaValidation = Joi.object({
    employeeId: Joi.number().required().label("employeeId"),
    monthPeriod: Joi.number().optional().label("monthPeriod").min(1).max(12),
    yearPeriod: Joi.number().optional().label("yearPeriod").min(1),
});

const createAllPayslipSchemaValidation = Joi.object({
    monthPeriod: Joi.number().optional().label("monthPeriod").min(1).max(12),
    yearPeriod: Joi.number().optional().label("yearPeriod").min(1),
});

const createSummPayslipSchemaValidation = Joi.object({
    employeeId: Joi.number().optional().label("employeeId"),
    monthPeriod: Joi.number().optional().label("monthPeriod").min(1).max(12),
    yearPeriod: Joi.number().optional().label("yearPeriod").min(1),
});

module.exports = {
    createPayslipByIdSchemaValidation,
    createAllPayslipSchemaValidation,
    createSummPayslipSchemaValidation,
};

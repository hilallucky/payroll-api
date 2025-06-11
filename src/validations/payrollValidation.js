const Joi = require("joi").extend(require("@joi/date"));
const { payrollType, payrollStatus } = require("../constants/contsant");
const validPayrollStatus = Object.values(payrollStatus);

const createPayrollSchemaValidation = Joi.object({
    startDate: Joi.date()
        .format("YYYY-MM-DD")
        .required()
        .utc()
        .label("startDate"),
    endDate: Joi.date()
        .format("YYYY-MM-DD")
        .required()
        .utc()
        .min(Joi.ref("startDate"))
        .required(),
    monthPeriod: Joi.number().required().label("monthPeriod").min(1).max(12),
    yearPeriod: Joi.number().required().label("yearPeriod").min(1),
    status: Joi.string()
        .optional()
        .label("status")
        .valid(...validPayrollStatus),
});

module.exports = {
    createPayrollSchemaValidation,
};

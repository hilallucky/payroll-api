const Joi = require("joi").extend(require("@joi/date"));
const { payrollType, payrollStatus } = require("../constants/contsant");
const validPayrollStatus = Object.values(payrollStatus);

const createPayrollchemaValidation = Joi.object({
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
    status: Joi.string()
        .optional()
        .label("status")
        .valid(...validPayrollStatus),
});

module.exports = {
    createPayrollchemaValidation,
};

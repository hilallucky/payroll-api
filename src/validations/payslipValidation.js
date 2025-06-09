const Joi = require("joi").extend(require("@joi/date"));
const { payslipStatus } = require("../constants/contsant");
const validPayslipStatus = Object.values(payslipStatus);

const createPayslipSchemaValidation = Joi.object({
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
        .valid(...validPayslipStatus),
});

module.exports = {
    createPayslipSchemaValidation,
};

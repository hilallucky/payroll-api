const { approvalStatus } = require("../constants/contsant");

const Joi = require("joi").extend(require("@joi/date"));

const createReimbursementSchemaValidation = Joi.object({
    employeeId: Joi.number().required().label("employeeId"),
    payrollId: Joi.number().optional().label("payrollId"),
    amount: Joi.number().required().label("amount"),
    description: Joi.string().required().label("description"),
    date: Joi.date().format("YYYY-MM-DD").required().utc().label("date"),
    status: Joi.string()
        .optional()
        .label("status")
        .default(approvalStatus.PENDING),
});

module.exports = {
    createReimbursementSchemaValidation,
};

const Joi = require("joi").extend(require("@joi/date"));

const createOvertimeSchemaValidation = Joi.object({
    employeeId: Joi.number().required().label("employeeId"),
    payrollId: Joi.number().optional().label("payrollId"),
    duration: Joi.number().optional().label("duration").min(1).max(3),
    startDate: Joi.date()
        .format("YYYY-MM-DD HH:mm:ss")
        .required()
        .utc()
        .label("startDate"),
    endDate: Joi.date()
        .format("YYYY-MM-DD HH:mm:ss")
        .optional()
        .utc()
        .label("startDate"),
    description: Joi.string().required().label("description"),
});

module.exports = {
    createOvertimeSchemaValidation,
};

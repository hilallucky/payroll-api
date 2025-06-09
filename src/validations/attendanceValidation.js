const Joi = require("joi").extend(require("@joi/date"));
const { attendanceType } = require("../constants/contsant");
const validAttendanceTypes = Object.values(attendanceType);

const createAttendanceSchemaValidation = Joi.object({
    employeeId: Joi.number().required().label("employeeId"),
    payrollId: Joi.number().optional().label("payrollId"),
    attendanceDate: Joi.date()
        .format("YYYY-MM-DD HH:mm:ss")
        .required()
        .label("attendanceDate"),
    attendanceType: Joi.string()
        .required()
        .label("attendanceType")
        .valid(...validAttendanceTypes),
});

const createAttendancePeriodSchemaValidation = Joi.object({
    payrollId: Joi.number().optional().label("payrollId"),
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
        // .greater(Joi.ref("startDate"))
        .required(),
});

module.exports = {
    createAttendancePeriodSchemaValidation,
    createAttendanceSchemaValidation,
};

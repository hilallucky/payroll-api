const moment = require("moment");
const { Op, Sequelize } = require("sequelize");
const { Overtime, Employee } = require("../models");

createOvertime = async (
    employeeId,
    payrollId,
    date,
    startDate,
    endDate,
    hours,
    description,
    userId,
    ipAddress
) => {
    let payrollIdVal = payrollId ? payrollId : null;

    const chekWorkHour = await chekEmployeeWorkHour(employeeId);

    const proposeTimeAvaliable =
        moment(chekWorkHour.checkOutSchedule, "HHmmss").format("HH:mm:ss") <
        moment(date, "HHmmss").format("HH:mm:ss");

    if (chekWorkHour && !proposeTimeAvaliable) {
        return errorResponse(
            res,
            "Not allowed to propose overtime this time.",
            "Overtime hours exceed work hours. Try again in few hours.",
            statusCodes.BAD_REQUEST
        );
    }

    const newOvertime = await Overtime.create({
        employeeId,
        payrollId: payrollIdVal,
        date,
        startDate,
        endDate,
        hours,
        description,
        userId,
        createdBy: userId,
        updatedBy: userId,
        ipAddress: ipAddress,
    });

    return newOvertime;
};

chekEmployeeWorkHour = async (employeeId) => {
    const chekEmployeeData = await Employee.findOne({
        where: {
            id: employeeId,
        },
    });

    return chekEmployeeData;
};

getAllOvertime = async (req, res) => {
    const overtimes = await Overtime.findAll();
    return overtimes;
};

getAllOvertimeByEmployeeId = async (id) => {
    const overtimes = await Overtime.findAll({
        where: {
            employeeId: id,
        },
    });
    return overtimes;
};

module.exports = {
    createOvertime,
    getAllOvertime,
    getAllOvertimeByEmployeeId,
};

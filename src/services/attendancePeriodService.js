const { Op } = require("sequelize");
const { AttendancePeriod } = require("../models");

createAttendancePeriod = async (
    payrollId,
    startDate,
    endDate,
    userId,
    ipAddress
) => {
    const overlappingPeriods = await chekOverlapping(startDate, endDate);
    if (overlappingPeriods.length > 0) {
        throw new Error("Overlapping periods found");
    }

    const newPeriod = await AttendancePeriod.create({
        payrollId,
        userId,
        createdBy: userId,
        updatedBy: userId,
        ipAddress: ipAddress,
        startDate,
        endDate,
    });

    return newPeriod;
};

chekOverlapping = async (startDate, endDate) => {
    const checkPeriods = await AttendancePeriod.findAll({
        attibutes: [
            "periodId",
            "userId",
            "createdBy",
            "updatedBy",
            "ipAddress",
            "startDate",
            "endDate",
        ],
        where: {
            [Op.or]: [
                {
                    startDate: { [Op.lte]: startDate },
                    endDate: { [Op.gte]: endDate },
                },
                { startDate: { [Op.between]: [startDate, endDate] } },
                { endDate: { [Op.between]: [startDate, endDate] } },
            ],
        },
    });

    return checkPeriods;
};

getAllAttendancePeriods = async (payrollId, startDate, endDate) => {
    let condition = { where: {} };

    if (payrollId) {
        condition.where.payrollId = payrollId;
    }

    if (startDate && endDate) {
        Object.assign(condition.where, {
            [Op.or]: [
                {
                    startDate: { [Op.lte]: startDate },
                    endDate: { [Op.gte]: endDate },
                },
                { startDate: { [Op.between]: [startDate, endDate] } },
                { endDate: { [Op.between]: [startDate, endDate] } },
            ],
        });
    }

    const periods = await AttendancePeriod.findAll(condition);
    return periods;
};

getAllAttendancePeriodsById = async (id) => {
    const periods = await AttendancePeriod.findAll({
        where: {
            id,
        },
    });
    return periods;
};

module.exports = {
    createAttendancePeriod,
    chekOverlapping,
    getAllAttendancePeriods,
    getAllAttendancePeriodsById,
};

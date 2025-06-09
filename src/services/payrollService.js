const { Op, Sequelize, Error } = require("sequelize");

const {
    Payroll,
    Attendance,
    AttendanceLog,
    AttendancePeriod,
    Overtime,
    Reimbursement,
    sequelize,
} = require("../models");
const { statusCodes } = require("../constants/contsant");

createPayroll = async (startDate, endDate, userId, ipAddress, req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const overlapping = await chekOverlappingDates(
            startDate,
            endDate,
            transaction
        );

        const dataOverlap = JSON.parse(JSON.stringify(overlapping));
        if (dataOverlap.length > 0) {
            throw new Error("Overlapping periods found");
        }

        const newPayroll = await Payroll.create(
            {
                createdBy: userId,
                updatedBy: userId,
                ipAddress: ipAddress,
                startDate,
                endDate,
            },
            { transaction, returning: ["id"] }
        );

        const getAttendaces = await Attendance.update(
            {
                payrollId: newPayroll.id,
                updatedBy: userId,
                updatedAt: new Date(),
                ipAddress,
            },
            {
                where: {
                    [Op.and]: [
                        Sequelize.where(
                            Sequelize.fn("DATE", Sequelize.col("checkIn")),
                            {
                                [Op.between]: [
                                    new Date(startDate)
                                        .toISOString()
                                        .slice(0, 10),
                                    new Date(endDate)
                                        .toISOString()
                                        .slice(0, 10),
                                ],
                            }
                        ),
                        { payrollId: null },
                    ],
                },
            },
            { transaction, returning: true }
        );

        const getAttendaceLogs = await AttendanceLog.update(
            {
                payrollId: newPayroll.id,
                updatedBy: userId,
                updatedAt: new Date(),
                ipAddress,
            },
            {
                where: {
                    [Op.and]: [
                        Sequelize.where(
                            Sequelize.fn(
                                "DATE",
                                Sequelize.col("attendanceDate")
                            ),
                            {
                                [Op.between]: [
                                    new Date(startDate)
                                        .toISOString()
                                        .slice(0, 10),
                                    new Date(endDate)
                                        .toISOString()
                                        .slice(0, 10),
                                ],
                            }
                        ),
                        { payrollId: null },
                    ],
                },
            },
            { transaction, returning: true }
        );

        const getAttendacePeriods = await AttendancePeriod.update(
            {
                payrollId: newPayroll.id,
                updatedBy: userId,
                updatedAt: new Date(),
                userId,
                ipAddress,
            },
            {
                where: {
                    [Op.and]: [
                        Sequelize.where(
                            Sequelize.fn("DATE", Sequelize.col("startDate")),
                            {
                                [Op.between]: [
                                    new Date(startDate)
                                        .toISOString()
                                        .slice(0, 10),
                                    new Date(endDate)
                                        .toISOString()
                                        .slice(0, 10),
                                ],
                            }
                        ),
                        { payrollId: null },
                    ],
                },
            },
            { transaction, returning: true }
        );

        const getOvertimes = await Overtime.update(
            {
                payrollId: newPayroll.id,
                updatedBy: userId,
                updatedAt: new Date(),
                userId,
            },
            {
                where: {
                    [Op.or]: [
                        Sequelize.where(
                            Sequelize.fn("DATE", Sequelize.col("startDate")),
                            {
                                [Op.between]: [
                                    new Date(startDate)
                                        .toISOString()
                                        .slice(0, 10),
                                    new Date(endDate)
                                        .toISOString()
                                        .slice(0, 10),
                                ],
                            }
                        ),
                        Sequelize.where(
                            Sequelize.fn("DATE", Sequelize.col("endDate")),
                            {
                                [Op.between]: [
                                    new Date(startDate)
                                        .toISOString()
                                        .slice(0, 10),
                                    new Date(endDate)
                                        .toISOString()
                                        .slice(0, 10),
                                ],
                            }
                        ),
                        { payrollId: null },
                    ],
                },
            },
            { transaction, returning: true }
        );

        const getReimbursements = await Reimbursement.update(
            {
                payrollId: newPayroll.id,
                updatedBy: userId,
                updatedAt: new Date(),
                userId,
            },
            {
                where: {
                    [Op.and]: [
                        Sequelize.where(
                            Sequelize.fn("DATE", Sequelize.col("date")),
                            {
                                [Op.between]: [
                                    new Date(startDate)
                                        .toISOString()
                                        .slice(0, 10),
                                    new Date(endDate)
                                        .toISOString()
                                        .slice(0, 10),
                                ],
                            }
                        ),
                        { payrollId: null },
                    ],
                },
            },
            { transaction, returning: true }
        );

        await transaction.commit();
        return {
            newPayroll,
            attendaces: getAttendaces[0],
            attendaceLogs: getAttendaceLogs[0],
            atendacePeriods: getAttendacePeriods[0],
            overtimes: getOvertimes[0],
            reimbursements: getReimbursements[0],
        };
    } catch (err) {
        if (transaction) {
            await transaction.rollback();
        }
        if (
            err.message ===
            "Overlapping periods found for the requested date range."
        ) {
            throw new Error("Overlapping periods found");
        }
        if ((err = "Overlapping periods found")) {
            throw new Error("Overlappingw periods found");
        }
        throw new Error(err.message);
    }
};

chekOverlappingDates = async (startDate, endDate, transaction) => {
    const checkPayrolls = await Payroll.findAll(
        {
            attibutes: [
                "id",
                "startDate",
                "endDate",
                "totalRecord",
                "totalEmployee",
                "status",
                "createdBy",
                "updatedBy",
                "ipAddress",
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
        },
        { transaction, returning: true }
    );

    return checkPayrolls;
};

getAllPayrolls = async (payrollId, startDate, endDate) => {
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

    const payrolls = await Payroll.findAll(condition);
    return payrolls;
};

getAllPayrollsById = async (id) => {
    const periods = await Payroll.findAll({
        where: {
            id,
        },
    });
    return periods;
};

module.exports = {
    createPayroll,
    chekOverlappingDates,
    getAllPayrolls,
    getAllPayrollsById,
};

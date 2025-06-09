const { Op, Sequelize, Error } = require("sequelize");

const {
    Payslip,
    AttendancePeriod,
    AttendanceLog,
    Attendance,
    Overtime,
    Reimbursement,
    sequelize,
} = require("../models");
const { statusCodes } = require("../constants/contsant");

createPayslip = async (startDate, endDate, userId, ipAddress, req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const overlappings = await chekOverlappingDates(
            userId,
            startDate,
            endDate,
            transaction
        );

        const dataOverlap = JSON.parse(JSON.stringify(overlappings));
        if (dataOverlap.length > 0) {
            throw new Error("Overlapping periods found");
        }

        const newPayslip = await Payslip.create(
            {
                employeeId: userId,
                startDate,
                endDate,
                baseSalary,
                proratedSalary,
                attendances,
                workingDays,
                overtimeHours,
                overtimePay,
                totalReimbursements,
                totalPay,
                createdBy: userId,
                updatedBy: userId,
                ipAddress: ipAddress,
            },
            { transaction, returning: ["id"] }
        );

        const getAttendaces = await Attendance.update(
            {
                payslipId: newPayslip.id,
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
                        { payslipId: null },
                    ],
                },
            },
            { transaction, returning: true }
        );

        const getAttendaceLogs = await AttendanceLog.update(
            {
                payslipId: newPayslip.id,
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
                        { payslipId: null },
                    ],
                },
            },
            { transaction, returning: true }
        );

        const getAttendacesPeriod = await AttendancePeriod.update(
            {
                payslipId: newPayslip.id,
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
                        { payslipId: null },
                    ],
                },
            },
            { transaction, returning: true }
        );

        const getOvertimes = await Overtime.update(
            {
                payslipId: newPayslip.id,
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
                        { payslipId: null },
                    ],
                },
            },
            { transaction, returning: true }
        );

        const getReimbursements = await Reimbursement.update(
            {
                payslipId: newPayslip.id,
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
                        { payslipId: null },
                    ],
                },
            },
            { transaction, returning: true }
        );

        await transaction.commit();
        return {
            newPayslip,
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

getDataFromPayroll = async (payrollId) => {
    const data = await Payroll.findOne({ where: { id: payrollId } });
    return data;
};

getAllPayslips = async (payslipId, startDate, endDate) => {
    let condition = { where: {} };

    if (payslipId) {
        condition.where.payslipId = payslipId;
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

    const periods = await Payslip.findAll(condition);
    return periods;
};

getAllPayslipsById = async (id) => {
    const periods = await Payslip.findAll({
        where: {
            id,
        },
    });
    return periods;
};

module.exports = {
    createPayslip,
    chekOverlappingDates,
    getAllPayslips,
    getAllPayslipsById,
};

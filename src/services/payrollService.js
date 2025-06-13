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

createPayroll = async (startDate, endDate, userId, ipAddress, req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const overlapping = await chekOverlappingDates(
            employeeId,
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

        const data = {
            newPayrollId: newPayroll.id,
            userId: userId,
            dateNow: new Date(),
            ipAddress: ipAddress,
            startDate: startDate,
            endDate: endDate,
        };

        const getAttendaces = await updateAttendance(data, transaction);

        const getAttendaceLogs = await updateAttendanceLog(data, transaction);

        const getAttendacePeriods = await updateAttendancePeriod(
            data,
            transaction
        );

        const getOvertimes = await updateOvertime(data, transaction);

        const getReimbursements = await updateReimbursement(data, transaction);

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

chekOverlappingDates = async (employeeId, startDate, endDate, transaction) => {
    const checkPayrolls = await Payroll.findOne(
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
                employeeId,
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

updateAttendance = async (data, transaction) => {
    const getAttendaces = await Attendance.update(
        {
            payrollId: data.newPayrollId, //newPayroll.id,
            updatedBy: data.userId,
            updatedAt: data.updatedAt, //new Date(),
            userId: data.userId,
            ipAddress: data.ipAddress,
        },
        {
            where: {
                [Op.and]: [
                    Sequelize.where(
                        Sequelize.fn("DATE", Sequelize.col("checkIn")),
                        {
                            [Op.between]: [
                                new Date(data.startDate)
                                    .toISOString()
                                    .slice(0, 10),
                                new Date(data.endDate)
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

    return getAttendaces;
};

updateAttendanceLog = async (data, transaction) => {
    const getAttendaceLogs = await AttendanceLog.update(
        {
            payrollId: data.newPayrollId, //newPayroll.id,
            updatedBy: data.userId,
            updatedAt: data.updatedAt, //new Date(),
            userId: data.userId,
            ipAddress: data.ipAddress,
        },
        {
            where: {
                [Op.and]: [
                    Sequelize.where(
                        Sequelize.fn("DATE", Sequelize.col("attendanceDate")),
                        {
                            [Op.between]: [
                                new Date(data.startDate)
                                    .toISOString()
                                    .slice(0, 10),
                                new Date(data.endDate)
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

    return getAttendaceLogs;
};

updateAttendancePeriod = async (data, transaction) => {
    const getAttendacePeriods = await AttendancePeriod.update(
        {
            payrollId: data.newPayrollId, //newPayroll.id,
            updatedBy: data.userId,
            updatedAt: data.updatedAt, //new Date(),
            userId: data.userId,
            ipAddress: data.ipAddress,
        },
        {
            where: {
                [Op.and]: [
                    Sequelize.where(
                        Sequelize.fn("DATE", Sequelize.col("startDate")),
                        {
                            [Op.between]: [
                                new Date(data.startDate)
                                    .toISOString()
                                    .slice(0, 10),
                                new Date(data.endDate)
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

    return getAttendacePeriods;
};

updateOvertime = async (data, transaction) => {
    const getOvertimes = await Overtime.update(
        {
            payrollId: data.newPayrollId, //newPayroll.id,
            updatedBy: data.updatedAt, //new Date(),
            updatedBy: data.userId,
            ipAddress: data.ipAddress,
            userId: data.userId,
        },
        {
            where: {
                [Op.or]: [
                    Sequelize.where(
                        Sequelize.fn("DATE", Sequelize.col("startDate")),
                        {
                            [Op.between]: [
                                new Date(data.startDate)
                                    .toISOString()
                                    .slice(0, 10),
                                new Date(data.endDate)
                                    .toISOString()
                                    .slice(0, 10),
                            ],
                        }
                    ),
                    Sequelize.where(
                        Sequelize.fn("DATE", Sequelize.col("endDate")),
                        {
                            [Op.between]: [
                                new Date(data.startDate)
                                    .toISOString()
                                    .slice(0, 10),
                                new Date(data.endDate)
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

    return getOvertimes;
};

updateReimbursement = async (data, transaction) => {
    const getReimbursements = await Reimbursement.update(
        {
            payrollId: data.newPayrollId, // newPayroll.id,
            updatedBy: data.userId,
            updatedAt: data.updatedAt, // new Date(),
            ipAddress: data.ipAddress,
            userId: data.userId,
        },
        {
            where: {
                [Op.and]: [
                    Sequelize.where(
                        Sequelize.fn("DATE", Sequelize.col("date")),
                        {
                            [Op.between]: [
                                new Date(data.startDate)
                                    .toISOString()
                                    .slice(0, 10),
                                new Date(data.endDate)
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

    return getReimbursements;
};

getAllAttendanceByEmployeeId = async (
    employeeId,
    startDate,
    endDate,
    transaction
) => {
    const attendance = await Attendance.findAll(
        {
            attributes: [
                "id",
                "employeeId",
                "payrollId",
                "payslipId",
                "checkIn",
                "checkOut",
                "overTimeIn",
                "overTimeOut",
            ],
            where: {
                employeeId,
                payrollId: null,
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
    return attendance;
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

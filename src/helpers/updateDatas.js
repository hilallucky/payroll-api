const { Op } = require("sequelize");

const {
    Attendance,
    AttendanceLog,
    AttendancePeriod,
    Overtime,
    Reimbursement,
    Sequelize,
} = require("../models");
const summarizeEmployeeTimes = require("../utils/summarizeTimes");

updateAttendance = async (data, transaction) => {
    const getAttendaces = await Attendance.update(
        {
            payrollId: data.newPayrollPeriod,
            updatedBy: data.userId,
            updatedAt: data.updatedAt,
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
            transaction,
            returning: true,
        }
    );

    if (getAttendaces[1].length > 0) {
        const plainOvertimes = getAttendaces[1]; //JSON.parse(JSON.stringify(getAttendaces[1]));

        const summWorkHours = summarizeEmployeeTimes(
            plainOvertimes,
            "workHours"
        );
        const summOverTimes = summarizeEmployeeTimes(
            plainOvertimes,
            "overtimeHours"
        );

        return {
            getAttendaces,
            summWorkHours,
            summOverTimes,
        };
    }

    return {
        getAttendaces,
        summWorkHours: 0,
        summOverTimes: 0,
    };
};

updateAttendanceLog = async (data, transaction) => {
    const getAttendaceLogs = await AttendanceLog.update(
        {
            payrollId: data.newPayrollPeriod,
            updatedBy: data.userId,
            updatedAt: data.updatedAt,
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
            transaction,
            returning: true,
        }
    );

    return getAttendaceLogs;
};

updateAttendancePeriod = async (data, transaction) => {
    const getAttendacePeriods = await AttendancePeriod.update(
        {
            payrollId: data.newPayrollPeriod,
            updatedBy: data.userId,
            updatedAt: data.updatedAt,
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
            transaction,
            returning: true,
        }
    );

    return getAttendacePeriods;
};

updateOvertime = async (data, transaction) => {
    let prevEmpId = null,
        totalOvertimeEmployee = 0;

    const getOvertimes = await Overtime.update(
        {
            payrollId: data.newPayrollPeriod,
            updatedBy: data.updatedAt,
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
            transaction,
            returning: true,
        }
    );

    if (getOvertimes[1].length > 0) {
        getOvertimes[1].forEach((emp) => {
            if (prevEmpId !== emp.employeeId) {
                totalOvertimeEmployee++;
                prevEmpId = emp.employeeId;
            }
        });
    }

    return { ...getOvertimes, totalOvertimeEmployee: totalOvertimeEmployee };
};

updateReimbursement = async (data, transaction) => {
    const getReimbursements = await Reimbursement.update(
        {
            payrollId: data.newPayrollPeriod,
            updatedBy: data.userId,
            updatedAt: data.updatedAt,
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
            transaction,
            returning: true,
        }
    );

    const plainReimbursements = getReimbursements[1]; //JSON.parse(JSON.stringify(getReimbursements[1]));

    const summary = { grandTotal: 0, employees: {} };

    plainReimbursements.forEach((item) => {
        const amount = parseInt(item.amount);
        summary.grandTotal += amount;

        if (!summary.employees[item.employeeId]) {
            summary.employees[item.employeeId] = 0;
        }
        summary.employees[item.employeeId] += amount;
    });

    const employeeTotals = Object.entries(summary.employees).map(
        ([employeeId, total]) => ({
            employeeId: parseInt(employeeId),
            totalAmount: total,
        })
    );

    return {
        getReimbursements,
        grandTotal: summary.grandTotal,
        employeeTotals,
    };
};

module.exports = {
    updateAttendance,
    updateAttendanceLog,
    updateAttendancePeriod,
    updateOvertime,
    updateReimbursement,
};

const { Op, Error } = require("sequelize");
const moment = require("moment");

const { Employee, Payroll, PayrollPeriod, sequelize } = require("../models");
const { processPayrollData } = require("../helpers/payrollData");
const { addNewPayrollData } = require("../helpers/addPayrollData");
const {
    getActiveEmployees,
    countEmployeeAttencances,
    chekOverlappingDates,
} = require("../helpers/getDatas");
const {
    updateAttendance,
    updateAttendancePeriod,
    updateAttendanceLog,
    updateOvertime,
    updateReimbursement,
} = require("../helpers/updateDatas.js");

createPayroll = async (
    monthPeriod,
    yearPeriod,
    startDate,
    endDate,
    userId,
    ipAddress,
    req,
    res
) => {
    const transaction = await sequelize.transaction();
    try {
        const overlapping = await chekOverlappingDates(
            startDate,
            endDate,
            transaction
        );

        const dataOverlap = overlapping;
        if (dataOverlap.length > 0) {
            throw new Error("Overlapping periods found");
        }

        const dateNow = new Date();
        const newPayrollPeriod = await PayrollPeriod.create(
            {
                monthPeriod,
                yearPeriod,
                processedBy: userId,
                processedAt: dateNow,
                createdBy: userId,
                updatedBy: userId,
                ipAddress: ipAddress,
                startDate,
                endDate,
            },
            { transaction, returning: ["id"] }
        );

        const getAllEmployees = await getActiveEmployees(transaction);
        const employees = getAllEmployees;

        const data = {
            newPayrollPeriod: newPayrollPeriod.id,
            userId: userId,
            dateNow: dateNow,
            ipAddress: ipAddress,
            startDate: startDate,
            endDate: endDate,
        };
        const getAttendances = await updateAttendance(data, transaction);
        const getAttendanceLogs = await updateAttendanceLog(data, transaction);
        const getAttendancePeriods = await updateAttendancePeriod(
            data,
            transaction
        );
        const getOvertimes = await updateOvertime(data, transaction);
        const getReimbursements = await updateReimbursement(data, transaction);

        const convertPayrolData = await countEmployeeAttencances(
            data,
            getAttendances.getAttendaces[1],
            getOvertimes[1],
            getReimbursements.getReimbursements[1],
            transaction
        );

        const processDataPayroll = processPayrollData(convertPayrolData);
        const newPayroll = await addNewPayrollData(
            processDataPayroll.data,
            {
                userId,
                payrollPeriodId: newPayrollPeriod.id,
                startDate,
                endDate,
                ipAddress,
            },
            transaction
        );

        newPayrollPeriod.totalActiveEmployee = employees.length || 0;
        newPayrollPeriod.totalWorkEmployee =
            processDataPayroll.totalWorkEmployee || 0;
        newPayrollPeriod.totalWorkHour =
            getAttendances.summWorkHours.grandTotal || "00:00:00";
        newPayrollPeriod.totalOvertimeEmployee =
            getOvertimes.totalOvertimeEmployee;
        newPayrollPeriod.totalOvertimeHour =
            getAttendances.summOverTimes.grandTotal || "00:00:00";
        newPayrollPeriod.totalReimbursementEmployee =
            getReimbursements.employeeTotals.length;
        newPayrollPeriod.totalReimbursement = getReimbursements.grandTotal || 0;
        newPayrollPeriod.totalOvertime =
            processDataPayroll.grandTotalOvertimePay || 0;
        newPayrollPeriod.totalSalaryProrate =
            processDataPayroll.grandTotalSalaryProrate || 0;
        newPayrollPeriod.totalSalary = processDataPayroll.grandTotalSalary || 0;
        await newPayrollPeriod.save({ transaction });

        await transaction.commit();

        return {
            ...JSON.parse(JSON.stringify(newPayrollPeriod)),
            attendances: getAttendances[0],
            attendanceLogs: getAttendanceLogs[0],
            atendancePeriods: getAttendancePeriods[0],
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
        if (err === "Overlapping periods found") {
            throw new Error("Overlappingw periods found");
        }
        throw new Error(err.message);
    }
};

getAllPayrolls = async (payrollId, startDate, endDate) => {
    let condition = {
        where: {},
        include: [
            {
                model: PayrollPeriod,
                as: "payrollPeriod",
                attributes: ["monthPeriod", "yearPeriod"],
            },
            {
                model: Employee,
                as: "employee",
                attributes: ["fullName"],
            },
        ],
    };

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
            payrollPeriodId: id,
        },
        include: [
            {
                model: PayrollPeriod,
                as: "payrollPeriod",
                attributes: ["monthPeriod", "yearPeriod"],
            },
            {
                model: Employee,
                as: "employee",
                attributes: ["fullName"],
            },
        ],
    });
    return periods;
};

getAllPayrollsByPeriod = async (monthPeriod, yearPeriod) => {
    const periods = await Payroll.findAll({
        include: [
            {
                model: PayrollPeriod,
                as: "payrollPeriod",
                attributes: ["monthPeriod", "yearPeriod"],
                where: {
                    monthPeriod,
                    yearPeriod,
                },
            },
        ],
    });
    return periods;
};

module.exports = {
    createPayroll,
    getAllPayrolls,
    getAllPayrollsById,
    getAllPayrollsByPeriod,
};

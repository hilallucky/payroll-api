const { Payroll } = require("../models");

addNewPayrollData = async (dataPayroll, dataAdditional, transaction) => {
    const payrollMap = new Map();

    dataPayroll.forEach((payroll) => {
        const totalPay =
            parseFloat(payroll.salaryProrate) +
            parseFloat(payroll.overTimeSalary) +
            parseFloat(payroll.totalReimbursements);
        payrollMap.set(payroll.employeeId, {
            employeeId: payroll.employeeId,
            payrollPeriodId: dataAdditional.payrollPeriodId,
            baseSalary: payroll.salaryPerHour,
            startDate: dataAdditional.startDate,
            endDate: dataAdditional.endDate,
            proratedSalary: payroll.salaryProrate,
            attendances: payroll.workDays,
            workingDays: payroll.workDays,
            workingHours: payroll.workHours,
            overtimeHours: payroll.overtimeHours,
            overtimePay: payroll.overTimeSalary,
            totalReimbursements: payroll.totalReimbursements,
            totalPay: totalPay,
            userId: dataAdditional.userId,
            ipAddress: dataAdditional.ipAddress,
        });
    });

    const preparedData = Array.from(payrollMap.values());

    const newPayroll = await Payroll.bulkCreate(preparedData, {
        transaction,
        returning: true,
    });
    return newPayroll;
};

module.exports = { addNewPayrollData };

const { Op, Sequelize, Error, where } = require("sequelize");

const {
    Employee,
    PayrollPeriod,
    Payroll,
    Reimbursement,
    sequelize,
} = require("../models");
const { statusCodes } = require("../constants/contsant");

getAllPayslipsById = async (data) => {
    try {
        const result = await Payroll.findAll({
            attributes: [
                "employeeId",
                "payrollPeriodId",
                "startDate",
                "endDate",
                "baseSalary",
                "workingDays",
                "workingHours",
                "proratedSalary",
                "overtimeHours",
                "overtimePay",
                "totalReimbursements",
                "totalPay",
            ],
            where: {
                employeeId: data.employeeId,
            },
            include: [
                {
                    model: PayrollPeriod,
                    as: "payrollPeriod",
                    attributes: ["monthPeriod", "yearPeriod"],
                    where:
                        data.month && data.year
                            ? {
                                  monthPeriod: data.month,
                                  yearPeriod: data.year,
                              }
                            : {},
                    include: [
                        {
                            model: Reimbursement,
                            as: "reimbursement",
                            attributes: ["id", "date", "amount"],
                            where: {
                                employeeId: data.employeeId,
                            },
                        },
                    ],
                    required: true,
                },

                {
                    model: Employee,
                    as: "employee",
                    attributes: ["fullName", "email", "status"],
                },
            ],
        });

        return result;
    } catch (err) {
        throw new Error(err.message);
    }
};

getAllPayslips = async (data) => {
    try {
        const result = await Payroll.findAll({
            attributes: [
                "employeeId",
                "monthPeriod",
                "yearPeriod",
                "startDate",
                "endDate",
                "baseSalary",
                "workingDays",
                "workingHours",
                "proratedSalary",
                "overtimeHours",
                "overtimePay",
                "totalReimbursements",
                "totalPay",
            ],
            condition,
            include: {
                model: Employee,
                as: "employee",
                attributes: ["fullName", "email", "status"],
            },
        });

        return result;
    } catch (err) {
        throw new Error(err.message);
    }
};

generateSummaryPayslip = async (data) => {
    const summPayrolls = await Payroll.findAndCountAll({
        attributes: [
            "employeeId",
            [Sequelize.fn("SUM", Sequelize.col("totalPay")), "totalPay"],
        ],
        where: data.employeeId
            ? {
                  employeeId: data.employeeId,
              }
            : {},
        group: [
            "employeeId",
            "employee.id",
            "employee.fullName",
            "payrollPeriod.id",
            "payrollPeriod.monthPeriod",
            "payrollPeriod.yearPeriod",
        ],
        include: [
            {
                model: PayrollPeriod,
                as: "payrollPeriod",
                attributes: ["monthPeriod", "yearPeriod"],
                where:
                    data.month && data.year
                        ? {
                              monthPeriod: data.month,
                              yearPeriod: data.year,
                          }
                        : {},
                required: true,
            },

            {
                model: Employee,
                as: "employee",
                attributes: ["fullName"],
            },
        ],
    });

    return summPayrolls ? summPayrolls.rows : [];
};

getAllPayrollPeriod = async () => {
    const data = await PayrollPeriod.findAll({
        attributes: ["id", "monthPeriod", "yearPeriod", "startDate", "endDate"],
        order: [
            ["yearPeriod", "DESC"],
            ["monthPeriod", "DESC"],
        ],
    });
    return data;
};

module.exports = {
    getAllPayslipsById,
    getAllPayslips,
    generateSummaryPayslip,
    getAllPayrollPeriod,
};

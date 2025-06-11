"use strict";
const { Model } = require("sequelize");
const { payrollStatus } = require("../constants/contsant");
module.exports = (sequelize, DataTypes) => {
    class Payroll extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Payroll.belongsTo(models.PayrollPeriod, {
                foreignKey: "payrollPeriodId",
                as: "payrollPeriod",
            });
            Payroll.hasMany(models.Attendance, {
                foreignKey: "payrollId",
                as: "attendance",
            });
            Payroll.hasMany(models.Overtime, {
                foreignKey: "payrollId",
                as: "overtime",
            });
            Payroll.hasMany(models.Reimbursement, {
                foreignKey: "payrollId",
                as: "reimbursement",
            });
            Payroll.belongsTo(models.Employee, {
                foreignKey: "employeeId",
                as: "employee",
            });
        }
    }
    Payroll.init(
        {
            employeeId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "Employees",
                    key: "id",
                },
            },
            payrollPeriodId: { type: DataTypes.INTEGER },
            startDate: DataTypes.DATEONLY,
            endDate: DataTypes.DATEONLY,
            baseSalary: { type: DataTypes.DECIMAL, defaultValue: 0 },
            proratedSalary: { type: DataTypes.DECIMAL, defaultValue: 0 },
            attendances: { type: DataTypes.INTEGER, defaultValue: 0 },
            workingDays: { type: DataTypes.INTEGER, defaultValue: 0 },
            workingHours: { type: DataTypes.STRING, defaultValue: "00:00:00" },
            overtimeDays: { type: DataTypes.INTEGER, defaultValue: 0 },
            overtimeHours: { type: DataTypes.STRING, defaultValue: "00:00:00" },
            overtimePay: { type: DataTypes.DECIMAL, defaultValue: 0 },
            totalReimbursements: { type: DataTypes.DECIMAL, defaultValue: 0 },
            totalPay: { type: DataTypes.DECIMAL, defaultValue: 0 },
            notes: DataTypes.TEXT,
            status: {
                type: DataTypes.STRING,
                defaultValue: payrollStatus.PAYROLLED,
            },
            userId: DataTypes.STRING,
            ipAddress: DataTypes.STRING,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
            createdBy: DataTypes.INTEGER,
            updatedBy: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "Payroll",
        }
    );
    return Payroll;
};

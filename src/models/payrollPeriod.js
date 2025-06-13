"use strict";
const { Model } = require("sequelize");
const { payrollStatus } = require("../constants/contsant");
module.exports = (sequelize, DataTypes) => {
    class PayrollPeriod extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            PayrollPeriod.hasMany(models.Payroll, {
                foreignKey: "payrollPeriodId",
                as: "payroll",
            });
            PayrollPeriod.hasMany(models.Reimbursement, {
                foreignKey: "payrollId",
                as: "reimbursement",
            });
        }
    }
    PayrollPeriod.init(
        {
            monthPeriod: DataTypes.INTEGER,
            yearPeriod: DataTypes.INTEGER,
            startDate: DataTypes.DATEONLY,
            endDate: DataTypes.DATEONLY,
            totalActiveEmployee: { type: DataTypes.INTEGER, defaultValue: 0 },
            totalWorkEmployee: { type: DataTypes.INTEGER, defaultValue: 0 },
            totalWorkHour: { type: DataTypes.STRING, defaultValue: "00:00:00" },
            totalOvertimeEmployee: { type: DataTypes.INTEGER, defaultValue: 0 },
            totalOvertimeHour: {
                type: DataTypes.STRING,
                defaultValue: "00:00:00",
            },
            totalOvertime: {
                type: DataTypes.DECIMAL,
                defaultValue: 0,
            },
            totalReimbursement: { type: DataTypes.DECIMAL, defaultValue: 0 },
            totalReimbursementEmployee: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            totalSalaryProrate: {
                type: DataTypes.DECIMAL,
                defaultValue: 0,
            },
            totalSalary: {
                type: DataTypes.DECIMAL,
                defaultValue: 0,
            },
            status: {
                type: DataTypes.STRING,
                defaultValue: payrollStatus.PAYROLLED,
            },
            processedBy: DataTypes.INTEGER,
            processedAt: DataTypes.DATE,
            userId: DataTypes.STRING,
            ipAddress: DataTypes.STRING,
            createdAt: DataTypes.DATE,
            createdBy: DataTypes.STRING,
            updatedAt: DataTypes.DATE,
            updatedBy: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "PayrollPeriod",
        }
    );
    return PayrollPeriod;
};

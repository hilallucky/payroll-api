"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Payslip extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Payslip.init(
        {
            employeeId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "Employees",
                    key: "id",
                },
            },
            payrollId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "Payrolls",
                    key: "id",
                },
            },
            startDate: DataTypes.DATEONLY,
            endDate: DataTypes.DATEONLY,
            baseSalary: { type: DataTypes.DECIMAL, defaultValue: 0 },
            proratedSalary: { type: DataTypes.DECIMAL, defaultValue: 0 },
            attendances: { type: DataTypes.INTEGER, defaultValue: 0 },
            workingDays: { type: DataTypes.INTEGER, defaultValue: 0 },
            overtimeHours: { type: DataTypes.DECIMAL, defaultValue: 0 },
            overtimePay: { type: DataTypes.DECIMAL, defaultValue: 0 },
            totalReimbursements: { type: DataTypes.DECIMAL, defaultValue: 0 },
            totalPay: { type: DataTypes.DECIMAL, defaultValue: 0 },
            notes: DataTypes.TEXT,
            userId: DataTypes.STRING,
            ipAddress: DataTypes.STRING,
            createdAt: DataTypes.DATE,
            createdBy: DataTypes.STRING,
            updatedAt: DataTypes.DATE,
            updatedBy: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Payslip",
        }
    );
    return Payslip;
};

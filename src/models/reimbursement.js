"use strict";
const { Model } = require("sequelize");
const { approvalStatus } = require("../constants/contsant");
module.exports = (sequelize, DataTypes) => {
    class Reimbursement extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Reimbursement.belongsTo(models.Employee, {
                foreignKey: "employeeId",
            });
        }
    }
    Reimbursement.init(
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            employeeId: {
                type: DataTypes.INTEGER,
                allowNull: false,
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
            payslipId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "Payslips",
                    key: "id",
                },
            },
            amount: {
                type: DataTypes.DECIMAL,
                allowNull: false,
                defaultValue: 0,
            },
            description: {
                type: DataTypes.TEXT,
            },
            date: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            status: {
                type: DataTypes.TEXT,
                allowNull: false,
                defaultValue: approvalStatus.PENDING,
            },
            userId: DataTypes.INTEGER,
            ipAddress: DataTypes.TEXT,
            craetedAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
            createdBy: DataTypes.INTEGER,
            updatedBy: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "Reimbursement",
        }
    );
    return Reimbursement;
};

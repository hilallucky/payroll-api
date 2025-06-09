"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Overtime extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Overtime.belongsTo(models.Employee, {
                foreignKey: "employeeId",
            });
            // Overtime.belongsTo(models.Payroll, {
            //     foreignKey: "payrollId",
            // });
        }
    }
    Overtime.init(
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
            date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            startDate: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            endDate: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            hours: {
                type: DataTypes.DECIMAL(4, 2),
                allowNull: false,
                validate: {
                    min: 0.1,
                    max: 3,
                },
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            userId: DataTypes.INTEGER,
            craetedAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
            createdBy: DataTypes.INTEGER,
            updatedBy: DataTypes.INTEGER,
            ipAddress: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Overtime",
        }
    );
    return Overtime;
};

"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Attendance extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Attendance.belongsTo(models.Employee, {
                foreignKey: "employeeId",
                as: "employee",
            });
            Attendance.belongsTo(models.Employee, {
                foreignKey: "userId",
            });
        }
    }
    Attendance.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
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
            payslipId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "Payslips",
                    key: "id",
                },
            },
            checkIn: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            checkOut: {
                type: DataTypes.DATE,
            },
            workHours: {
                type: DataTypes.STRING(10),
                defaultValue: "00:00:00",
            },
            overTimeIn: {
                type: DataTypes.DATE,
            },
            overTimeOut: {
                type: DataTypes.DATE,
            },
            overtimeHours: {
                type: DataTypes.STRING(10),
                defaultValue: "00:00:00",
            },
            userId: DataTypes.INTEGER,
            ipAddress: DataTypes.STRING,
            createdAt: DataTypes.DATE,
            createdBy: DataTypes.INTEGER,
            updatedAt: DataTypes.DATE,
            updatedBy: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "Attendance",
        }
    );
    return Attendance;
};

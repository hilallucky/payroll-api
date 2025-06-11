"use strict";

const { Model } = require("sequelize");
const sequelize = require("../config/database");
const { employeeStatus } = require("../constants/contsant");

module.exports = (sequelize, DataTypes) => {
    class Employee extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Employee.hasMany(models.Attendance, {
                foreignKey: "employeeId",
                as: "attendance",
            });
            Employee.hasMany(models.Attendance, {
                foreignKey: "userId",
                as: "attendanceUser",
            });
            Employee.hasMany(models.AttendanceLog, {
                foreignKey: "employeeId",
                as: "attendanceLog",
            });
            Employee.hasMany(models.AttendanceLog, {
                foreignKey: "userId",
                as: "attendanceLogUser",
            });
            Employee.hasMany(models.Payroll, {
                foreignKey: "employeeId",
                as: "payroll",
            });
        }
    }
    Employee.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            fullName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                },
            },
            checkInSchedule: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "09:00:00",
            },
            checkOutSchedule: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "17:00:00",
            },
            maxOverTimePerDay: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 3,
            },
            monthlySalary: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
            },
            salaryPerHour: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
            },
            status: {
                type: DataTypes.STRING,
                defaultValue: employeeStatus.ACTIVE,
            },
            isAdmin: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            userId: DataTypes.STRING,
            ipAddress: DataTypes.STRING,
            createdBy: DataTypes.INTEGER,
            createdAt: DataTypes.DATE,
            updatedBy: DataTypes.INTEGER,
            updatedAt: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: "Employee",
        }
    );
    return Employee;
};

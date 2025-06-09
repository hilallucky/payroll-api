"use strict";
const { Model, STRING } = require("sequelize");
const { attendanceType } = require("../constants/contsant");
module.exports = (sequelize, DataTypes) => {
    class AttendanceLog extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    AttendanceLog.init(
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
            attendanceType: {
                type: STRING(10),
                allowNull: false,
                defaultValue: attendanceType.CHECKIN,
            },
            attendanceDate: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
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
            modelName: "AttendanceLog",
        }
    );
    return AttendanceLog;
};

"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class AttendancePeriod extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {}
    }
    AttendancePeriod.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            payrollId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "Payrolls",
                    key: "id",
                },
            },
            startDate: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            endDate: {
                type: DataTypes.DATEONLY,
                allowNull: false,
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
            modelName: "AttendancePeriod",
        }
    );
    return AttendancePeriod;
};

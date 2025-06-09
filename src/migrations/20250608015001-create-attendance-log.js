"use strict";

const { attendanceType } = require("../constants/contsant");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("AttendanceLogs", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            employeeId: {
                type: Sequelize.INTEGER,
            },
            payrollId: {
                type: Sequelize.INTEGER,
            },
            payslipId: {
                type: Sequelize.INTEGER,
            },
            attendanceType: {
                type: Sequelize.STRING,
                defaultValue: attendanceType.CHECKIN,
            },
            attendanceDate: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
            },
            userId: {
                type: Sequelize.STRING,
            },
            ipAddress: {
                type: Sequelize.STRING,
            },
            createdBy: {
                type: Sequelize.STRING,
            },
            updatedBy: {
                type: Sequelize.STRING,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("AttendanceLogs");
    },
};

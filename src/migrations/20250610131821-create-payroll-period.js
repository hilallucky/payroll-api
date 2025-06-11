"use strict";

const { payrollStatus } = require("../constants/contsant");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("PayrollPeriods", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            monthPeriod: {
                type: Sequelize.INTEGER,
            },
            yearPeriod: {
                type: Sequelize.INTEGER,
            },
            startDate: {
                type: Sequelize.DATEONLY,
            },
            endDate: {
                type: Sequelize.DATEONLY,
            },
            totalActiveEmployee: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
            },
            totalWorkEmployee: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
            },
            totalWorkHour: {
                type: Sequelize.STRING,
                defaultValue: "00:00:00",
            },
            totalOvertimeEmployee: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
            },
            totalOvertime: {
                type: Sequelize.STRING,
                defaultValue: "00:00:00",
            },
            totalReimbursement: {
                type: Sequelize.INTEGER,
            },
            totalReimbursementEmployee: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
            },
            status: {
                type: Sequelize.STRING,
                defaultValue: payrollStatus.PAYROLLED,
            },
            processedBy: {
                type: Sequelize.INTEGER,
            },
            processedAt: {
                type: Sequelize.DATE,
            },
            userId: {
                type: Sequelize.STRING,
            },
            ipAddress: {
                type: Sequelize.STRING,
            },
            createdAt: {
                type: Sequelize.DATE,
            },
            createdBy: {
                type: Sequelize.STRING,
            },
            updatedAt: {
                type: Sequelize.DATE,
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
        await queryInterface.dropTable("PayrollPeriods");
    },
};

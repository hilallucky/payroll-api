"use strict";

const { payrollStatus } = require("../constants/contsant");
const { sequelize } = require("../models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Payrolls", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            employeeId: {
                type: Sequelize.INTEGER,
            },
            payrollPeriodId: {
                type: Sequelize.INTEGER,
            },
            baseSalary: {
                type: Sequelize.DECIMAL,
                defaultValue: 0,
            },
            startDate: { type: Sequelize.DATEONLY },
            endDate: { type: Sequelize.DATEONLY },
            proratedSalary: {
                type: Sequelize.DECIMAL,
                defaultValue: 0,
            },
            attendances: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
            },
            workingDays: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
            },
            workingHours: {
                type: Sequelize.STRING,
                defaultValue: "00:00:00",
            },
            overtimeDays: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
            },
            overtimeHours: {
                type: Sequelize.STRING,
                defaultValue: "00:00:00",
            },
            overtimePay: {
                type: Sequelize.DECIMAL,
                defaultValue: 0,
            },
            totalReimbursements: {
                type: Sequelize.DECIMAL,
                defaultValue: 0,
            },
            totalPay: {
                type: Sequelize.DECIMAL,
                defaultValue: 0,
            },
            notes: {
                type: Sequelize.TEXT,
            },
            status: {
                type: Sequelize.STRING,
                defaultValue: payrollStatus.PAYROLLED,
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
            updatedAt: {
                type: Sequelize.DATE,
            },
            createdBy: {
                type: Sequelize.INTEGER,
            },
            updatedBy: {
                type: Sequelize.INTEGER,
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
        await queryInterface.dropTable("Payrolls");
    },
};

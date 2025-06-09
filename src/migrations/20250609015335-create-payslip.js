"use strict";

const { payslipStatus } = require("../constants/contsant");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Payslips", {
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
            startDate: {
                type: Sequelize.DATEONLY,
            },
            endDate: {
                type: Sequelize.DATEONLY,
            },
            baseSalary: {
                type: Sequelize.DECIMAL,
                defaultValue: 0,
            },
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
            overtimeHours: {
                type: Sequelize.DECIMAL,
                defaultValue: 0,
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
                defaultValue: payslipStatus.PAYSLIPED,
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
        await queryInterface.dropTable("Payslips");
    },
};

"use strict";

const { approvalStatus } = require("../constants/contsant");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Reimbursements", {
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
            amount: {
                type: Sequelize.DECIMAL,
            },
            description: {
                type: Sequelize.TEXT,
            },
            status: {
                type: Sequelize.STRING,
                defaultValue: approvalStatus.PENDING,
            },
            date: {
                type: Sequelize.DATEONLY,
            },
            userId: {
                type: Sequelize.INTEGER,
            },
            ipAddress: {
                type: Sequelize.TEXT,
            },
            craetedAt: {
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
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Reimbursements");
    },
};

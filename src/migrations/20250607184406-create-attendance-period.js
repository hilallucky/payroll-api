"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("AttendancePeriods", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            payrollId: {
                type: Sequelize.INTEGER,
            },
            payslipId: {
                type: Sequelize.INTEGER,
            },
            startDate: {
                type: Sequelize.DATEONLY,
            },
            endDate: {
                type: Sequelize.DATEONLY,
            },
            userId: {
                type: Sequelize.INTEGER,
            },
            createdBy: {
                type: Sequelize.INTEGER,
            },
            updatedBy: {
                type: Sequelize.INTEGER,
            },
            ipAddress: {
                type: Sequelize.STRING,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("AttendancePeriods");
    },
};

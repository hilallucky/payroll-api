"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Overtimes", {
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
            date: {
                type: Sequelize.DATEONLY,
            },
            startDate: {
                type: Sequelize.DATE,
            },
            endDate: {
                type: Sequelize.DATE,
            },
            hours: {
                type: Sequelize.INTEGER,
            },
            description: {
                type: Sequelize.TEXT,
            },
            userId: {
                type: Sequelize.STRING,
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
            ipAddress: {
                type: Sequelize.STRING,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Overtimes");
    },
};

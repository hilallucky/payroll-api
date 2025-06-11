"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Attendances", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            employeeId: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            payrollId: {
                type: Sequelize.INTEGER,
            },
            payslipId: {
                type: Sequelize.INTEGER,
            },
            checkIn: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
            },
            checkOut: {
                type: Sequelize.DATE,
            },
            workHours: {
                type: Sequelize.STRING(10),
                defaultValue: "00:00:00",
            },
            overTimeIn: {
                type: Sequelize.DATE,
            },
            overTimeOut: {
                type: Sequelize.DATE,
            },
            overtimeHours: {
                type: Sequelize.STRING(10),
                defaultValue: "00:00:00",
            },
            userId: Sequelize.INTEGER,
            ipAddress: Sequelize.STRING,
            createdAt: Sequelize.DATE,
            createdBy: Sequelize.INTEGER,
            updatedAt: Sequelize.DATE,
            updatedBy: Sequelize.INTEGER,
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Attendances");
    },
};

"use strict";

const { employeeStatus } = require("../constants/contsant");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Employees", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            username: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            fullName: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                },
            },
            checkInSchedule: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: "09:00:00",
            },
            checkOutSchedule: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: "17:00:00",
            },
            maxOverTimePerDay: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 3,
            },
            monthlySalary: {
                type: Sequelize.DECIMAL,
                allowNull: false,
                defaultValue: 0,
            },
            salaryPerHour: {
                type: Sequelize.DECIMAL,
                allowNull: false,
                defaultValue: 0,
            },
            isAdmin: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            status: {
                type: Sequelize.STRING,
                defaultValue: employeeStatus.ACTIVE,
            },
            userId: {
                type: Sequelize.STRING,
            },
            ipAddress: {
                type: Sequelize.STRING,
            },
            createdBy: {
                type: Sequelize.INTEGER,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            updatedBy: {
                type: Sequelize.INTEGER,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Employees");
    },
};

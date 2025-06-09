"use strict";
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
        await queryInterface.dropTable("Employees");
    },
};

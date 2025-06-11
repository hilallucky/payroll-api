"use strict";

const bcrypt = require("bcrypt");
const faker = require("faker");
const { employeeStatus } = require("../constants/contsant");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async (queryInterface, Sequelize) => {
        const now = new Date();
        const transaction = await queryInterface.sequelize.transaction();

        try {
            // 1. Create Admin
            const adminPassword = await bcrypt.hash("admin123", 10);
            const [adminId] = await queryInterface.bulkInsert(
                "Employees",
                [
                    {
                        username: "admin",
                        password: adminPassword,
                        fullName: "System Administrator",
                        email: "admin@payroll.com",
                        monthlySalary: 15000.0,
                        isAdmin: true,
                        createdAt: now,
                        updatedAt: now,
                        updatedBy: 1,
                        ipAddress: "127.0.0.1",
                    },
                ],
                { transaction, returning: ["id"] }
            );

            // 2. Create 100 Employees
            const employeePassword = await bcrypt.hash("password123", 10);
            const employees = Array.from({ length: 100 }, (_, i) => ({
                username: faker.internet.userName(),
                password: employeePassword,
                fullName: faker.name.findName(),
                email: faker.internet.email(),
                monthlySalary: faker.datatype.number({ min: 3000, max: 12000 }),
                salaryPerHour: faker.datatype.number({ min: 75, max: 100 }),
                isAdmin: false,
                status: employeeStatus.ACTIVE,
                createdAt: now,
                updatedAt: now,
                createdBy: adminId.id,
                updatedBy: adminId.id,
                ipAddress: faker.internet.ip(),
            }));

            const employeeIds = await queryInterface.bulkInsert(
                "Employees",
                employees,
                {
                    transaction,
                    returning: ["id"],
                }
            );

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("Employees", null, {});
    },
};

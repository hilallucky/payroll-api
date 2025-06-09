"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("AuditLogs", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            tableName: {
                type: Sequelize.STRING,
            },
            recordId: {
                type: Sequelize.INTEGER,
            },
            operation: {
                type: Sequelize.STRING,
            },
            changes: {
                type: Sequelize.JSON,
            },
            userId: {
                type: Sequelize.INTEGER,
            },
            ipAddress: {
                type: Sequelize.STRING,
            },
            requestId: {
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
        await queryInterface.dropTable("AuditLogs");
    },
};

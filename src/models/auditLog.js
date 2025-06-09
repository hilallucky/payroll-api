"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class AuditLog extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    AuditLog.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            tableName: DataTypes.STRING,
            recordId: DataTypes.INTEGER,
            operation: DataTypes.STRING,
            changes: DataTypes.JSON,
            userId: DataTypes.INTEGER,
            ipAddress: DataTypes.STRING,
            requestId: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "AuditLog",
        }
    );
    return AuditLog;
};

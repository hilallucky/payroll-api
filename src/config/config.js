require("dotenv").config();

module.exports = {
    development: {
        username: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "HilaL@123",
        database: process.env.DB_NAME || "payroll_db",
        host: process.env.DB_HOST || "127.0.0.1",
        dialect: process.env.DB_DIALECT || "postgres",
        dialectOptions: {
            ssl:
                process.env.DB_SSL === "true"
                    ? {
                          require: true,
                          rejectUnauthorized: false,
                      }
                    : false,
        },
        logging: console.log, // Enable SQL query logging
        define: {
            underscored: false, // Use snake_case for column names
            timestamps: true, // Add createdAt and updatedAt fields
            paranoid: false, // Add deletedAt field (soft deletes)
        },
    },
    test: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME_TEST,
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        logging: false,
    },
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    },
};

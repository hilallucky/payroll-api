const { Sequelize } = require("sequelize");
const sequelize = new Sequelize({
    dialect: "postgres",
    logging: false,
    host: process.env.DB_HOST || "localhost",
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "HilaL@123",
    database: process.env.DB_NAME_TEST || process.env.DB_NAME,
    // storage: ":memory:",
});

beforeAll(async () => {
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    await sequelize.close();
});

jest.setTimeout(10000); // extend timeout if needed for DB

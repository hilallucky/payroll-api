require("dotenv").config({ path: ".env.test" });

module.exports = {
    testEnvironment: "node",
    roots: ["./tests"],
    coveragePathIgnorePatterns: ["/node_modules/"],
    setupFilesAfterEnv: ["./tests/setup.js"],
};

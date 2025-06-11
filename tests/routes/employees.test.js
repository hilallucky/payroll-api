const request = require("supertest");
const app = require("../../src/app");
const Employee = require("../../src/models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

describe("Employee API", () => {
    let testUser;

    beforeAll(async () => {
        testUser = {
            id: 1,
            username: "testuser",
            password: await bcrypt.hash("password123", 10),
        };
        // Employee.findOne.mockResolvedValue(testUser); // Mock findAll to return the employees

        // Generate a valid JWT for the test user
        const payload = { user: { username: testUser.username } };
        authToken = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
    });

    // --- Employee CRUD Tests ---
    describe("Employee CRUD Operations (Authenticated)", () => {
        // Test GET /api/employees
        it("should get all employees", async () => {
            const employees = {
                success: true,
                message: "Employees retrieved successfully",
                data: [
                    {
                        id: 1,
                        username: "admin",
                        fullName: "System Administrator",
                        email: "admin@payroll.com",
                        monthlySalary: "15000",
                    },
                ],
            };
            // Employee.findAll.mockResolvedValue(employees);

            const objToMatch = {
                success: expect.any(Boolean),
                message: expect.any(String),
                data: expect.any(Array),
            };

            const objDataToMatch = expect.objectContaining({
                id: expect.any(Number),
                username: expect.any(String),
                fullName: expect.any(String),
                email: expect.any(String),
                monthlySalary: expect.any(String),
            });

            const res = await request(app)
                .get("/api/v1.0/private/employees")
                .set("Authorization", `Bearer ${authToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toMatchObject(objToMatch);
            res.body.data.forEach((employee) => {
                expect(employee).toMatchObject(objDataToMatch);
            });
        });
    });
});

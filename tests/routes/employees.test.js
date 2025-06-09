// const request = require("supertest");
// const app = require("../../src/app");
// // // const { sequelize } = require("../../src/models");

// // const jwt = require("jsonwebtoken");

// // // Mock jwt
// // jest.mock("jsonwebtoken", () => ({
// //     verify: jest.fn(),
// // }));

// // const mockToken = (payload = { userId: "testUser" }) => {
// //     return `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${Buffer.from(
// //         JSON.stringify(payload)
// //     ).toString("base64")}.signature`;
// // };

// // // beforeAll(async () => {
// // //     try {
// // //         await sequelize.authenticate();
// // //         console.log("✅ DB connected successfully");
// // //     } catch (err) {
// // //         console.error("❌ Failed to connect to DB", err);
// // //     }
// // // });

// // // describe("GET /api/v1.0", () => {
// // //     it("should return 200", async () => {
// // //         const res = await request(app).get("/api/v1.0");

// // //         expect(res.statusCode).toBe(200);
// // //     });
// // // });

// // // describe("GET /api/v1.0/private/employees/check", () => {
// // //     it("should return employees with valid token", async () => {
// // //         const res = await request(app).get("/api/v1.0/private/employees/check");

// // //         expect(res.statusCode).toBe(200);
// // //         expect(res.body.success).toBe();
// // //     });
// // // });

// // describe("GET /api/v1.0/private/employees", () => {
// //     beforeEach(() => {
// //         jwt.verify.mockClear();
// //     });

// //     it("should return 401 without token", async () => {
// //         const res = await request(app).get("/api/v1.0/private/employees");
// //         expect(res.statusCode).toBe(401);
// //     });

// //     it("should success with valid token", async () => {
// //         const token = mockToken({ username: "admin" });
// //         jwt.verify.mockReturnValue({
// //             username: "admin",
// //             // password: "HilaL@123",
// //         });
// //         console.log(token);
// //         const res = await request(app)
// //             .get("/api/v1.0/private/employees")
// //             .set("Authorization", `Bearer ${token}`);
// //         console.log("Response:", res.body);
// //         // expect(res.statusCode).toBe(200);
// //     });

// //     // it("should return employees with valid token", async () => {
// //     //     // const token =
// //     //     //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsImlzQWRtaW4iOnRydWUsImlhdCI6MTc0OTI3ODQ2NywiZXhwIjoxNzQ5MzY0ODY3fQ.07JmNOjYQfTU2ERl1iokhnUgQEXNk2N3YnNNDiplDVk";

// //     //     const token = mockToken({ username: "admin", password: "123456" });
// //     //     jwt.verify.mockReturnValue({
// //     //         username: "admin",
// //     //         password: "123456",
// //     //     });
// //     //     const res = await request(app)
// //     //         .get("/api/v1.0/private/employees")
// //     //         .set("Authorization", `Bearer ${token}`);
// //     //     console.log("Response:", res.body);
// //     //     expect(res.statusCode).toBe(200);
// //     //     // expect(res.body.success).toBe(true);
// //     //     expect(res.body).toHaveProperty("employees");
// //     // });
// // });

// // // describe("Initial Test", () => {
// // //     it("should test that 1 + 1 === 2", () => {
// // //         expect(1 + 1).toBe(2);
// // //     });
// // // });

// const { generateMockToken } = require("../../src/utils/jwt-utils");
// const axios = require("axios");
// const dotenv = require("dotenv");

// dotenv.config();

// jest.mock("jsonwebtoken", () => ({
//     verify: jest
//         .fn()
//         .mockReturnValue({ username: "admin", roles: ["isAdmin"] }),
// }));

// jest.mock("axios", () => ({
//     get: jest.fn().mockResolvedValue({ data: [{ id: 1, name: "John Doe" }] }),
// }));

// describe("Employee API Tests", () => {
//     it("should fetch employees with a valid token", async () => {
//         const secretKey = process.env.JWT_SECRET;
//         const payload = { username: "admin", roles: ["admin"] };
//         const token = generateMockToken(payload, secretKey);
//         const url = "/api/v1.0/private/employees";

//         // const response = await axios.get(url, {
//         //     headers: { Authorization: `Bearer ${token}` },
//         // });
//         // console.log(response);
//         // console.log(response.status);

//         // // expect(response.status).toBe(200);

//         // expect(response.data).toEqual([{ id: 1, name: "John Doe" }]);
//         // const resx = expect(axios.get).toHaveBeenCalledWith(url, {
//         //     headers: { Authorization: `Bearer ${token}` },
//         // });
//         // console.log(resx);
//         const res = await request(app)
//             .get(url)
//             .set("Authorization", `Bearer ${token}`);

//         expect(res.statusCode).toBe(200);
//         expect(res.body.success).toBe();
//     });

//     // //     it("should return employees with valid token", async () => {
//     // //         const res = await request(app).get("/api/v1.0/private/employees/check");

//     // //         expect(res.statusCode).toBe(200);
//     // //         expect(res.body.success).toBe();
//     // //     });
// });

const request = require("supertest");
const app = require("../../src/app");
const Employee = require("../../src/models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

// Mock the Employee and User models to prevent actual database calls
// This assumes your setup.js file handles the initial mocking of sequelize.define,
// but for controller-level testing, you need to mock the methods on the models directly.
// jest.mock("../../src/models");

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

    // --- Authentication Tests ---
    // describe("Authentication Routes", () => {
    //     // it('should register a new user successfully', async () => {
    //     //     User.create.mockImplementation((user) => ({
    //     //         id: 2, // New user ID
    //     //         username: user.username,
    //     //         password: 'hashedpassword', // Mocked hashed password
    //     //         toJSON: () => ({ id: 2, username: user.username }) // To simulate sequelize instance
    //     //     }));

    //     //     const res = await request(app)
    //     //         .post('/api/auth/register')
    //     //         .send({ username: 'newuser', password: 'newpassword' });

    //     //     expect(res.statusCode).toEqual(201);
    //     //     expect(res.body).toHaveProperty('token');
    //     //     expect(res.body.msg).toEqual('User registered successfully');
    //     // });

    //     it("should login a user and return a token", async () => {
    //         // Mock comparePassword for the User instance
    //         User.findOne.mockResolvedValue({
    //             id: 1,
    //             username: "testuser",
    //             password: "hashedpassword", // In a real scenario, this would be the actual hashed password
    //             comparePassword: jest.fn().mockResolvedValue(true), // Mock comparison
    //             toJSON: () => ({ id: 1, username: "testuser" }),
    //         });

    //         const res = await request(app)
    //             .post("/api/v1.0//public/login")
    //             .send({ username: "testuser", password: "password123" });

    //         expect(res.statusCode).toEqual(200);
    //         expect(res.body).toHaveProperty("token");
    //     });

    //     it("should return 400 for invalid login credentials", async () => {
    //         User.findOne.mockResolvedValue(null); // User not found
    //         const res = await request(app)
    //             .post("/api/v1.0//public/login")
    //             .send({ username: "nonexistent", password: "wrong" });
    //         expect(res.statusCode).toEqual(400);
    //         expect(res.body.msg).toEqual("Invalid credentials");
    //     });
    // });

    // --- Employee CRUD Tests ---
    describe("Employee CRUD Operations (Authenticated)", () => {
        // Test POST /api/employees
        // it("should create a new employee", async () => {
        //     const newEmployeeData = {
        //         firstName: "Jane",
        //         lastName: "Doe",
        //         email: "jane.doe@example.com",
        //         position: "Software Engineer",
        //         hireDate: "2023-01-15",
        //     };

        //     // Mock the create method of the Employee model
        //     Employee.create.mockResolvedValue({
        //         id: 1,
        //         ...newEmployeeData,
        //         toJSON: () => ({ id: 1, ...newEmployeeData }), // Mock toJSON for cleaner output
        //     });
        //     Employee.findOne.mockResolvedValue(null); // Ensure no existing employee found

        //     const res = await request(app)
        //         .post("/api/employees")
        //         .set("x-auth-token", authToken) // Set the auth token
        //         .send(newEmployeeData);

        //     expect(res.statusCode).toEqual(201);
        //     expect(res.body.firstName).toEqual("Jane");
        //     expect(res.body.email).toEqual("jane.doe@example.com");
        //     expect(Employee.create).toHaveBeenCalledWith(newEmployeeData);
        // });

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

        // // Test GET /api/employees/:id
        // it("should get an employee by ID", async () => {
        //     const employee = {
        //         id: 1,
        //         firstName: "John",
        //         email: "john.doe@example.com",
        //         toJSON: () => ({
        //             id: 1,
        //             firstName: "John",
        //             email: "john.doe@example.com",
        //         }),
        //     };
        //     Employee.findByPk.mockResolvedValue(employee);

        //     const res = await request(app)
        //         .get("/api/employees/1")
        //         .set("x-auth-token", authToken);

        //     expect(res.statusCode).toEqual(200);
        //     expect(res.body.id).toEqual(1);
        //     expect(res.body.firstName).toEqual("John");
        //     expect(Employee.findByPk).toHaveBeenCalledWith(1);
        // });

        // it("should return 404 if employee by ID is not found", async () => {
        //     Employee.findByPk.mockResolvedValue(null); // Mock not found

        //     const res = await request(app)
        //         .get("/api/employees/999")
        //         .set("x-auth-token", authToken);

        //     expect(res.statusCode).toEqual(404);
        //     expect(res.body.msg).toEqual("Employee not found");
        // });

        // // Test PUT /api/employees/:id
        // it("should update an employee by ID", async () => {
        //     const existingEmployee = {
        //         id: 1,
        //         firstName: "John",
        //         lastName: "Doe",
        //         email: "john.doe@example.com",
        //         position: "Manager",
        //         hireDate: "2022-01-01",
        //         update: jest.fn().mockImplementation(function (data) {
        //             Object.assign(this, data); // Simulate update
        //             return this;
        //         }),
        //         toJSON: jest.fn(function () {
        //             return { ...this };
        //         }),
        //     };
        //     const updatedData = { position: "Senior Manager" };

        //     Employee.findByPk.mockResolvedValue(existingEmployee);

        //     const res = await request(app)
        //         .put("/api/employees/1")
        //         .set("x-auth-token", authToken)
        //         .send(updatedData);

        //     expect(res.statusCode).toEqual(200);
        //     expect(res.body.position).toEqual("Senior Manager");
        //     expect(existingEmployee.update).toHaveBeenCalledWith(updatedData);
        // });

        // it("should return 404 if employee to update is not found", async () => {
        //     Employee.findByPk.mockResolvedValue(null);

        //     const res = await request(app)
        //         .put("/api/employees/999")
        //         .set("x-auth-token", authToken)
        //         .send({ position: "New Position" });

        //     expect(res.statusCode).toEqual(404);
        //     expect(res.body.msg).toEqual("Employee not found");
        // });

        // // Test DELETE /api/employees/:id
        // it("should delete an employee by ID", async () => {
        //     const employeeToDelete = {
        //         id: 1,
        //         firstName: "John",
        //         destroy: jest.fn().mockResolvedValue(1), // Mock destroy returning 1 for successful deletion
        //         toJSON: jest.fn(function () {
        //             return { ...this };
        //         }),
        //     };
        //     Employee.findByPk.mockResolvedValue(employeeToDelete);

        //     const res = await request(app)
        //         .delete("/api/employees/1")
        //         .set("x-auth-token", authToken);

        //     expect(res.statusCode).toEqual(200);
        //     expect(res.body.msg).toEqual("Employee removed successfully");
        //     expect(employeeToDelete.destroy).toHaveBeenCalledTimes(1);
        // });

        // it("should return 404 if employee to delete is not found", async () => {
        //     Employee.findByPk.mockResolvedValue(null);

        //     const res = await request(app)
        //         .delete("/api/employees/999")
        //         .set("x-auth-token", authToken);

        //     expect(res.statusCode).toEqual(404);
        //     expect(res.body.msg).toEqual("Employee not found");
        // });
    });

    // describe("Authentication Middleware", () => {
    //     it("should return 401 if no token is provided", async () => {
    //         const res = await request(app).get("/api/v1.0/public/login");
    //         expect(res.statusCode).toEqual(401);
    //         expect(res.body.msg).toEqual("No token, authorization denied");
    //     });

    //     it("should return 401 if an invalid token is provided", async () => {
    //         const res = await request(app)
    //             .get("/api/v1.0/public/login")
    //             .set("x-auth-token", "invalid_token");
    //         expect(res.statusCode).toEqual(401);
    //         expect(res.body.msg).toEqual("Token is not valid");
    //     });
    // });
});

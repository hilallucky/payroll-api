const { Employee } = require("../models");

const getAllEmployees = async () => {
    const employees = await Employee.findAll({
        attributes: ["id", "username", "fullName", "email", "monthlySalary"],
    });
    return employees;
};

module.exports = {
    getAllEmployees,
};

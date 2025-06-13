const moment = require("moment");
const { Op, Sequelize } = require("sequelize");
const { Reimbursement, Employee } = require("../models");
const { getEmployeeById } = require("../helpers/getDatas");

createReimbursement = async (
    employeeId,
    payrollId,
    amount,
    description,
    status,
    date,
    userId,
    ipAddress
) => {
    let payrollIdVal = payrollId ? payrollId : null;

    const chekEmployeeData = await getEmployeeById(employeeId);

    if (!chekEmployeeData) {
        throw new Error("Employee not found");
    }

    const newReimbursement = await Reimbursement.create({
        employeeId,
        payrollId: payrollIdVal,
        amount,
        description,
        status,
        date,
        userId,
        createdBy: userId,
        updatedBy: userId,
        ipAddress: ipAddress,
    });

    return newReimbursement;
};

getAllReimbursement = async (req, res) => {
    const reimbursements = await Reimbursement.findAll({
        include: [
            {
                model: Employee,
                as: "employee",
                attributes: ["fullName"],
            },
        ],
    });
    return reimbursements;
};

getAllReimbursementByEmployeeId = async (id) => {
    const reimbursements = await Reimbursement.findAll({
        where: {
            employeeId: id,
        },
        include: [
            {
                model: Employee,
                as: "employee",
                attributes: ["fullName"],
            },
        ],
    });
    return reimbursements;
};

module.exports = {
    createReimbursement,
    getAllReimbursement,
    getAllReimbursementByEmployeeId,
};

const moment = require("moment");
const { Op, Sequelize } = require("sequelize");
const { Reimbursement, Employee } = require("../models");

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
    const reimbursements = await Reimbursement.findAll();
    return reimbursements;
};

getAllReimbursementByEmployeeId = async (id) => {
    const reimbursements = await Reimbursement.findAll({
        where: {
            employeeId: id,
        },
    });
    return reimbursements;
};

module.exports = {
    createReimbursement,
    getAllReimbursement,
    getAllReimbursementByEmployeeId,
};

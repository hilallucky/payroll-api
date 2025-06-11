const { Op } = require("sequelize");
const moment = require("moment");

const {
    Payroll,
    PayrollPeriod,
    Attendance,
    Employee,
    Sequelize,
} = require("../models");
const { employeeStatus } = require("../constants/contsant");

countEmployeeAttencances = async (
    data,
    allAttendances,
    allDataOvertimes,
    allDataReimbursements,
    transaction
) => {
    const countAttendances = await Attendance.findAndCountAll(
        {
            attributes: [
                "employeeId",
                [Sequelize.fn("COUNT", Sequelize.col("employeeId")), "days"],
            ],
            where: {
                [Op.and]: [
                    Sequelize.where(
                        Sequelize.fn("DATE", Sequelize.col("checkIn")),
                        {
                            [Op.between]: [
                                moment(data.startDate).startOf("day").toDate(),
                                moment(data.endDate).endOf("day").toDate(),
                            ],
                        }
                    ),
                    { payrollId: null },
                ],
            },
            group: [
                "employeeId",
                "employee.id",
                "employee.fullName",
                "employee.salaryPerHour",
            ],
            include: [
                {
                    model: Employee,
                    as: "employee",
                    attributes: ["fullName", "salaryPerHour"],
                    required: true,
                },
            ],
        },
        { transaction, returning: true }
    );

    return {
        countAttendances,
        allAttendances: allAttendances,
        allDataOvertimes: allDataOvertimes,
        allDataReimbursements: allDataReimbursements,
    };
};

chekOverlappingDates = async (startDate, endDate, transaction) => {
    const checkPayrolls = await PayrollPeriod.findAll(
        {
            attibutes: [
                "id",
                "startDate",
                "endDate",
                "totalRecord",
                "totalEmployee",
                "status",
                "createdBy",
                "updatedBy",
                "ipAddress",
            ],
            where: {
                [Op.or]: [
                    {
                        startDate: { [Op.lte]: startDate },
                        endDate: { [Op.gte]: endDate },
                    },
                    { startDate: { [Op.between]: [startDate, endDate] } },
                    { endDate: { [Op.between]: [startDate, endDate] } },
                ],
            },
        },
        { transaction, returning: true }
    );

    return checkPayrolls;
};

getActiveEmployees = async (transaction) => {
    const activeEmployees = await Employee.findAll({
        attributes: ["id", "fullName", "email"],
        where: {
            status: employeeStatus.ACTIVE,
        },
        transaction,
        returning: true,
    });

    return activeEmployees;
};

module.exports = {
    countEmployeeAttencances,
    chekOverlappingDates,
    getActiveEmployees,
};

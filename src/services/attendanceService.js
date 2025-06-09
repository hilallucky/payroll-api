const { Op, Sequelize } = require("sequelize");
const { Attendance, AttendanceLog } = require("../models");

createAttendance = async (
    employeeId,
    payrollId,
    attendanceType,
    attendanceDate,
    userId,
    ipAddress
) => {
    const transaction = await Attendance.sequelize.transaction();
    try {
        let payrollIdVal = payrollId ? payrollId : null;
        // 1. Create attendance log
        const newAttendaceLog = await AttendanceLog.create(
            {
                employeeId,
                payrollId: payrollIdVal,
                attendanceType,
                attendanceDate,
                userId,
                createdBy: userId,
                updatedBy: userId,
                ipAddress: ipAddress,
            },
            { transaction, returning: ["id"] }
        );

        // 2. Create/update attendace
        const chekEmployeeAttendaceDate =
            await chekEmployeeAttendaceDateIsExist(attendanceDate, employeeId);

        if (chekEmployeeAttendaceDate) {
            let columnName = "";
            switch (attendanceType) {
                case "CHECKIN":
                    columnName = "checkIn";
                    break;
                case "CHECKOUT":
                    columnName = "checkOut";
                    break;
                case "OVERTIMEIN":
                    columnName = "overTimeIn";
                    break;
                case "OVERTIMEOUT":
                    columnName = "overTimeOut";
                    break;
            }

            const updatedAttendace = await Attendance.update(
                {
                    employeeId,
                    payrollId: payrollIdVal,
                    userId,
                    updatedBy: userId,
                    ipAddress: ipAddress,
                    [columnName]: attendanceDate,
                },
                {
                    where: {
                        id: chekEmployeeAttendaceDate.id,
                    },
                    transaction,
                }
            );

            await transaction.commit();
            return updatedAttendace;
        }

        const newAttendace = await Attendance.create(
            {
                employeeId,
                attendanceDate: attendanceDate,
                checkIn: attendanceDate,
                userId,
                createdBy: userId,
                updatedBy: userId,
                ipAddress: ipAddress,
            },
            { transaction, returning: ["id"] }
        );

        await transaction.commit();

        return newAttendace;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

chekEmployeeAttendaceDateIsExist = async (attendanceDate, employeeId) => {
    const chekEmployeeAttendaceDate = await Attendance.findOne({
        where: {
            [Op.and]: [
                Sequelize.where(
                    Sequelize.fn("DATE", Sequelize.col("checkIn")),
                    Op.eq,
                    attendanceDate.slice(0, 10)
                ),
                { employeeId: employeeId },
            ],
        },
    });

    return chekEmployeeAttendaceDate;
};

getAllAttendance = async (req, res) => {
    const attendance = await Attendance.findAll();
    return attendance;
};

getAllAttendanceByEmployeeId = async (id) => {
    const attendance = await Attendance.findAll({
        where: {
            employeeId: id,
        },
    });
    return attendance;
};

module.exports = {
    createAttendance,
    // chekOverlappingDates,
    getAllAttendance,
    getAllAttendanceByEmployeeId,
};

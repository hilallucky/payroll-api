const { Op, fn, col, where, Sequelize } = require("sequelize");
const { Attendance, AttendanceLog, Employee, Overtime } = require("../models");
const moment = require("moment");

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
        const employee = await checkEmployee(employeeId);

        if (!employee) {
            throw new Error("Employee not found");
        }

        let payrollIdVal = payrollId ? payrollId : null;
        const attDate = attendanceDate
            ? attendanceDate
            : moment().format("YYYY-MM-DD HH:mm:ss");

        // 1. Create attendance log
        const newAttendaceLog = await AttendanceLog.create(
            {
                employeeId,
                payrollId: payrollIdVal,
                attendanceType,
                attendanceDate: attDate,
                userId,
                createdBy: userId,
                updatedBy: userId,
                ipAddress: ipAddress,
            },
            { transaction, returning: ["id"] }
        );

        // 2. Create/update attendace
        const chekEmployeeAttendace = await chekEmployeeAttendaceDateIsExist(
            attDate,
            employeeId,
            transaction
        );

        let columnName = "",
            data = {
                userId,
                updatedBy: userId,
                ipAddress: ipAddress,
            };

        switch (attendanceType) {
            case "CHECKIN":
                columnName = "checkIn";
                break;
            case "CHECKOUT":
                columnName = "checkOut";
                if (chekEmployeeAttendace) {
                    const workHours = calculateDuration(
                        chekEmployeeAttendace.checkIn,
                        attDate
                    );
                    data.workHours = workHours.timeFormat;
                }
                break;
            case "OVERTIMEIN":
                // columnName = "overTimeIn";
                const checkSchedule = await checkOverTimeSchedule(
                    employeeId,
                    employee.checkOut,
                    attDate,
                    transaction
                );

                if (checkSchedule) {
                    columnName = "overTimeIn";
                }
                break;
            case "OVERTIMEOUT":
                columnName = "overTimeOut";
                if (chekEmployeeAttendace.overTimeIn) {
                    const overtimeHours = calculateDuration(
                        chekEmployeeAttendace.overTimeIn,
                        attDate
                    );
                    console.log({ overtimeHours: overtimeHours.timeFormat });

                    data.overtimeHours = overtimeHours.timeFormat;
                }
                break;
        }

        data[columnName] = attDate;

        if (chekEmployeeAttendace) {
            const updatedAttendace = await Attendance.update(data, {
                where: {
                    id: chekEmployeeAttendace.id,
                },
                transaction,
                returning: true,
            });

            await transaction.commit();
            return updatedAttendace ? updatedAttendace[1][0] : updatedAttendace;
        }

        const newAttendace = await Attendance.create(
            { ...data, employeeId },
            { transaction, returning: ["id"] }
        );

        await transaction.commit();

        return newAttendace;
    } catch (error) {
        console.log(error);
        await transaction.rollback();
        throw error;
    }
};

calculateDuration = (start, end) => {
    const duration = moment.duration(
        moment(end, "YYYY-MM-DDTHH:mm:ss", true).diff(
            moment(start, "YYYY-MM-DDTHH:mm:ss.SSSZ", true)
        )
    );

    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();
    const seconds = duration.seconds();
    const hoursDecimal = (duration.asMinutes() / 60).toFixed(1);
    const hoursFloat = parseFloat(hoursDecimal);

    return {
        hours: hours,
        minutes: minutes,
        timeFormat: moment(duration.asMilliseconds()).format("HH:mm:ss"), //`${hours}:${minutes}:${seconds}`,
        hoursDecimal: hoursDecimal,
        hoursFloat: hoursFloat,
    };
};

checkEmployee = async (id) => {
    const employee = await Employee.findByPk(id);
    return employee;
};

chekEmployeeAttendaceDateIsExist = async (
    attendanceDate,
    employeeId,
    transaction
) => {
    const chekEmployeeAttendaceDate = await Attendance.findOne(
        {
            where: {
                employeeId,
                [Op.or]: [
                    {
                        checkIn: {
                            [Op.between]: [
                                moment(attendanceDate).startOf("day"),
                                moment(attendanceDate).endOf("day"),
                            ],
                        },
                    },
                    {
                        createdAt: {
                            [Op.between]: [
                                moment(attendanceDate).startOf("day"),
                                moment(attendanceDate).endOf("day"),
                            ],
                        },
                    },
                ],
            },
            order: [["checkIn", "DESC"]],
        },
        { transaction, returning: true }
    );

    return chekEmployeeAttendaceDate;
};

checkOverTimeSchedule = async (
    employeeId,
    checkOutSchedule,
    attendanceDate,
    transaction
) => {
    const overTimeSchedule = await Overtime.findOne(
        {
            where: { employeeId, date: attendanceDate },
        },
        { transaction, returning: true }
    );

    if (overTimeSchedule) {
        const checkTimeAvaliable =
            moment(overTimeSchedule.startDate).format("YYYY-MM-DD HH:mm:ss") <
            moment(attendanceDate).format("YYYY-MM-DD HH:mm:ss");

        if (!checkTimeAvaliable) {
            throw new Error(
                `Your overtime schedule is start from ${moment(
                    overTimeSchedule.startDate
                ).format("YYYY-MM-DD HH:mm:ss")} to ${moment(
                    overTimeSchedule.endDate
                ).format("YYYY-MM-DD HH:mm:ss")}`
            );
        }
    } else {
        throw new Error(
            "Not allowed to attend for overtime, because you not porpose overtime for this time."
        );
    }

    return overTimeSchedule;
};

getAllAttendance = async (req, res) => {
    const attendance = await Attendance.findAll({
        include: [
            {
                model: Employee,
                as: "employee",
                attributes: ["fullName"],
            },
        ],
    });
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

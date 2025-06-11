const { timeToHourstoMinutes } = require("../utils/convertData");

processPayrollData = (data) => {
    // Create a map of employee data
    const employeeMap = new Map();

    // Process countAttendances to get basic employee info
    data.countAttendances.count.forEach((emp) => {
        employeeMap.set(emp.employeeId, {
            employeeId: emp.employeeId,
            id: emp.id,
            fullName: emp.fullName,
            salaryPerHour: parseFloat(emp.salaryPerHour) || 0,
            workHours: "00:00:00",
            workDays: emp.count,
            overtimeHours: "00:00:00",
            totalReimbursements: 0,
            totalSalary: 0,
        });
    });

    // Process allAttendances to sum work hours and days
    data.allAttendances.forEach((att) => {
        if (employeeMap.has(att.employeeId)) {
            const emp = employeeMap.get(att.employeeId);

            // Sum work hours
            const currentHours = timeToHourstoMinutes(emp.workHours);
            const newHours = timeToHourstoMinutes(att.workHours);
            const totalHours = currentHours + newHours;

            // Convert back to HH:mm:ss
            const hours = Math.floor(totalHours);
            const minutes = Math.floor((totalHours % 1) * 60);
            const seconds = Math.floor((((totalHours % 1) * 60) % 1) * 60);

            emp.workHours = `${String(hours).padStart(2, "0")}:${String(
                minutes
            ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

            // Count work days (assuming one attendance record per day)
            // emp.workDays =
            //     data.countAttendances.rows.find(
            //         (r) => r.employeeId === att.employeeId
            //     )?.days || 0;

            // Sum overtime hours
            if (att.overtimeHours !== "00:00:00") {
                const currentOvertime = timeToHourstoMinutes(emp.overtimeHours);
                const newOvertime = timeToHourstoMinutes(att.overtimeHours);
                const totalOvertime = currentOvertime + newOvertime;

                const otHours = Math.floor(totalOvertime);
                const otMinutes = Math.floor((totalOvertime % 1) * 60);
                const otSeconds = Math.floor(
                    (((totalOvertime % 1) * 60) % 1) * 60
                );

                emp.overtimeHours = `${String(otHours).padStart(
                    2,
                    "0"
                )}:${String(otMinutes).padStart(2, "0")}:${String(
                    otSeconds
                ).padStart(2, "0")}`;
            }
        }
    });

    // Process allDataOvertimes to calculate overtime salary
    data.allDataOvertimes.forEach((ot) => {
        if (employeeMap.has(ot.employeeId)) {
            const emp = employeeMap.get(ot.employeeId);
            // Assuming overtime is already included in overtimeHours from attendance
            // Calculate overtime salary (1.5x normal rate)
            const overtimeRate = emp.salaryPerHour * 1.5;
            emp.overTimeSalary = (overtimeRate * ot.hours).toFixed(2);
        }
    });

    // Process allDataReimbursements
    data.allDataReimbursements.forEach((reimb) => {
        if (employeeMap.has(reimb.employeeId)) {
            const emp = employeeMap.get(reimb.employeeId);
            emp.totalReimbursements += parseFloat(reimb.amount) || 0;
        }
    });

    // Calculate salary prorate (work hours * hourly rate)
    employeeMap.forEach((emp) => {
        const hoursWorked = timeToHourstoMinutes(emp.workHours);
        emp.salaryProrate = (hoursWorked * emp.salaryPerHour).toFixed(2);

        // If overtime salary wasn't set from allDataOvertimes, calculate from attendance
        // if (!emp.overTimeSalary) {
        const overtimeHours = timeToHourstoMinutes(emp.overtimeHours);
        const overtimeRate = emp.salaryPerHour * 2;
        emp.overTimeSalary = (overtimeHours * overtimeRate).toFixed(2);
        // }
    });

    // Convert map to array
    return Array.from(employeeMap.values());
};

module.exports = { processPayrollData };
